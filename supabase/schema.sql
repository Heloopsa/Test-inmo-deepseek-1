-- =============================================
-- InmuebleRD - Database Schema
-- Real Estate SaaS for Dominican Republic
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- Profiles (vendedores, agentes, compradores)
-- =============================================
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  phone text,
  avatar_url text,
  role text check (role in ('buyer', 'seller', 'agent', 'admin')) default 'buyer',
  agency_name text,
  license_number text,
  bio text,
  subscription_plan text check (subscription_plan in ('free', 'basic', 'premium')) default 'free',
  subscription_expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- =============================================
-- Provincias (República Dominicana)
-- =============================================
create table if not exists provinces (
  id serial primary key,
  name text not null unique,
  slug text not null unique
);

-- =============================================
-- Municipios (por provincia)
-- =============================================
create table if not exists municipalities (
  id serial primary key,
  province_id int references provinces(id) on delete cascade,
  name text not null,
  slug text not null
);

-- =============================================
-- Propiedades
-- =============================================
create table if not exists properties (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  property_type text check (property_type in ('apartment', 'house', 'condo', 'land', 'commercial', 'office', 'local')) not null,
  operation_type text check (operation_type in ('sale', 'rent', 'rental_with_option')) not null,
  price numeric(12,2) not null,
  currency text check (currency in ('USD', 'DOP')) default 'USD',
  price_per_sqm numeric(10,2),
  area_sqm numeric(8,2) not null,
  bedrooms int check (bedrooms >= 0),
  bathrooms int check (bathrooms >= 0),
  parking_spaces int default 0,
  floor int default 0,
  year_built int,
  status text check (status in ('active', 'inactive', 'sold', 'rented')) default 'active',
  amenities text[],
  features jsonb,
  address text,
  latitude numeric(10,8),
  longitude numeric(11,8),
  municipality_id int references municipalities(id),
  neighborhood text,
  building_name text,
  condo_fee numeric(10,2),
  energy_cert text,
  photos text[],
  virtual_tour_url text,
  is_featured boolean default false,
  is_verified boolean default false,
  views_count int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =============================================
-- Leads / Inquisiciones
-- =============================================
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references properties(id) on delete cascade,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text,
  message text,
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  status text check (status in ('new', 'contacted', 'scheduled', 'converted', 'lost')) default 'new',
  agent_id uuid references profiles(id),
  created_at timestamp with time zone default now()
);

-- =============================================
-- Favoritos / Watchlist
-- =============================================
create table if not exists favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, property_id)
);

-- =============================================
-- Reviews para agentes
-- =============================================
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references profiles(id) on delete cascade,
  reviewer_name text not null,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Profiles RLS
alter table profiles enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own profile' and tablename = 'profiles') then
    create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own profile' and tablename = 'profiles') then
    create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public profiles visible to all' and tablename = 'profiles') then
    create policy "Public profiles visible to all" on profiles for select using (true);
  end if;
end $$;

-- Properties RLS
alter table properties enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Anyone can view active properties' and tablename = 'properties') then
    create policy "Anyone can view active properties" on properties for select using (status = 'active');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Agents manage own properties' and tablename = 'properties') then
    create policy "Agents manage own properties" on properties for all using (auth.uid() = agent_id);
  end if;
end $$;

-- Leads RLS
alter table leads enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Agents see leads for their properties' and tablename = 'leads') then
    create policy "Agents see leads for their properties" on leads
      for select using (
        exists (select 1 from properties where properties.id = leads.property_id and properties.agent_id = auth.uid())
      );
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Anyone can create leads' and tablename = 'leads') then
    create policy "Anyone can create leads" on leads for insert with check (true);
  end if;
end $$;

-- Favorites RLS
alter table favorites enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users see own favorites' and tablename = 'favorites') then
    create policy "Users see own favorites" on favorites for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users manage own favorites' and tablename = 'favorites') then
    create policy "Users manage own favorites" on favorites for all using (auth.uid() = user_id);
  end if;
end $$;

-- Reviews RLS
alter table reviews enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Anyone can view reviews' and tablename = 'reviews') then
    create policy "Anyone can view reviews" on reviews for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated users can create reviews' and tablename = 'reviews') then
    create policy "Authenticated users can create reviews" on reviews for insert with check (auth.uid() is not null);
  end if;
end $$;

-- =============================================
-- Triggers
-- =============================================

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_properties_updated_at on properties;
create trigger update_properties_updated_at
  before update on properties
  for each row
  execute function update_updated_at_column();

-- Increment views count
create or replace function increment_property_views()
returns trigger as $$
begin
  update properties set views_count = views_count + 1 where id = new.property_id;
  return new;
end;
$$ language plpgsql;

-- =============================================
-- STORAGE - Bucket para imágenes de propiedades
-- =============================================

-- Crear bucket (si no existe)
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Public Read' and tablename = 'objects' and schemaname = 'storage') then
    create policy "Public Read" on storage.objects for select using (bucket_id = 'property-images');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated Upload' and tablename = 'objects' and schemaname = 'storage') then
    create policy "Authenticated Upload" on storage.objects for insert with check (bucket_id = 'property-images' and auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Owner Update' and tablename = 'objects' and schemaname = 'storage') then
    create policy "Owner Update" on storage.objects for update using (bucket_id = 'property-images' and auth.uid() = owner);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Owner Delete' and tablename = 'objects' and schemaname = 'storage') then
    create policy "Owner Delete" on storage.objects for delete using (bucket_id = 'property-images' and auth.uid() = owner);
  end if;
end $$;

-- =============================================
-- INDEXES (performance)
-- =============================================
create index if not exists idx_properties_agent_id on properties(agent_id);
create index if not exists idx_properties_status on properties(status);
create index if not exists idx_properties_type on properties(property_type);
create index if not exists idx_properties_operation on properties(operation_type);
create index if not exists idx_properties_price on properties(price);
create index if not exists idx_properties_featured on properties(is_featured);
create index if not exists idx_properties_municipality on properties(municipality_id);
create index if not exists idx_leads_property on leads(property_id);
create index if not exists idx_favorites_user on favorites(user_id);
create index if not exists idx_reviews_agent on reviews(agent_id);

-- =============================================
-- SEED DATA - Provincias de RD
-- =============================================
insert into provinces (name, slug) values
  ('Distrito Nacional', 'distrito-nacional'),
  ('Santo Domingo Norte', 'santo-domingo-norte'),
  ('Santo Domingo Sur', 'santo-domingo-sur'),
  ('Santiago', 'santiago'),
  ('La Altagracia', 'la-altagracia'),
  ('Puerto Plata', 'puerto-plata'),
  ('San Cristóbal', 'san-cristobal'),
  ('Higüey', 'higuey'),
  ('La Romana', 'la-romana'),
  ('Samaná', 'samana'),
  ('Duarte', 'duarte'),
  ('El Seibo', 'el-seibo'),
  ('San Pedro de Macorís', 'san-pedro-de-macoris'),
  ('Monseñor Nouel', 'monsenor-nouel'),
  ('Santo Domingo Este', 'santo-domingo-este'),
  ('Peravia', 'peravia'),
  ('Valverde', 'valverde'),
  ('Espaillat', 'espaillat'),
  ('María Trinidad Sánchez', 'maria-trinidad-sanchez'),
  ('Hermanas Mirabal', 'hermanas-mirabal'),
  ('Cibao Nordeste - Cibao Norte', 'cibao-noreste-cibao-norte'),
  ('Cibao Nordeste - Cibao Central', 'cibao-noreste-cibao-central'),
  ('Cibao Nordeste - Cibao Noroeste', 'cibao-noreste-cibao-noroeste'),
  ('Cibao Norte - Santiago', 'cibao-norte-santiago'),
  ('Cibao Norte - Duarte', 'cibao-norte-duarte'),
  ('Cibao Norte - Espaillat', 'cibao-norte-espaillat'),
  ('Cibao Norte - Monseñor Nouel', 'cibao-norte-monsenor-nouel'),
  ('Cibao Norte - Puerto Plata', 'cibao-norte-puerto-plata'),
  ('Cibao Norte - Valverde', 'cibao-norte-valverde'),
  ('El Caribe - Hato Mayor', 'el-caribe-hato-mayor'),
  ('El Caribe - San Pedro de Macorís', 'el-caribe-san-pedro-de-macoris'),
  ('El Caribe - El Seibo', 'el-caribe-el-seibo'),
  ('El Cibao - Santiago', 'el-cibao-santiago'),
  ('La Costa - Barahona', 'la-costas-barahona'),
  ('La Costa - Bahoruco', 'la-costas-bahoruco'),
  ('La Costa - Independencia', 'la-costas-independencia'),
  ('La Costa - Peravia', 'la-costas-peravia'),
  ('La Costa - San Cristóbal', 'la-costas-san-cristobal'),
  ('La Costa - Sánchez Ramírez', 'la-costas-sanchez-ramirez'),
  ('El Noroeste - Cibao Noroeste', 'el-noroeste-cibao-noroeste'),
  ('El Noroeste - María Trinidad Sánchez', 'el-noroeste-maria-trinidad-sanchez'),
  ('El Norte - Duarte', 'el-norte-duarte'),
  ('El Norte - Espaillat', 'el-norte-espaillat'),
  ('El Norte - Hermanas Mirabal', 'el-norte-hermanas-mirabal'),
  ('El Norte - Puerto Plata', 'el-norte-puerto-plata'),
  ('El Norte - Valverde', 'el-norte-valverde'),
  ('El Sur - Bahoruco', 'el-sur-bahoruco'),
  ('El Sur - Barahona', 'el-sur-barahona'),
  ('El Sur - Independencia', 'el-sur-independencia')
on conflict (name) do nothing;

-- =============================================
-- SEED DATA - Municipios principales
-- =============================================

-- Distrito Nacional
insert into municipalities (province_id, name, slug) values
(1, 'Santo Domingo Oeste', 'santo-domingo-oeste'),
(1, 'Santo Domingo Centro', 'santo-domingo-centro'),
(1, 'Santo Domingo Este', 'santo-domingo-este')
on conflict do nothing;

-- Santo Domingo Norte
insert into municipalities (province_id, name, slug) values
(2, 'Los Alcarrizos', 'los-alcarrizos'),
(2, 'San Antonio de Guerra', 'san-antonio-de-guerra'),
(2, 'Santo Domingo Norte', 'santo-domingo-norte')
on conflict do nothing;

-- Santo Domingo Sur
insert into municipalities (province_id, name, slug) values
(3, 'Boca Chica', 'boca-chica'),
(3, 'Los Cacaos', 'los-cacaos'),
(3, 'Pueblo Nuevo', 'pueblo-nuevo')
on conflict do nothing;

-- Santiago
insert into municipalities (province_id, name, slug) values
(4, 'Santiago Centro', 'santiago-centro'),
(4, 'Cibao Norte - Santiago', 'cibao-norte-santiago'),
(4, 'Tamboril', 'tamboril')
on conflict do nothing;

-- La Altagracia (Punta Cana)
insert into municipalities (province_id, name, slug) values
(5, 'Bávaro', 'bavaro'),
(5, 'Uvero', 'uvero'),
(5, 'Higüey', 'higuey')
on conflict do nothing;

-- Puerto Plata
insert into municipalities (province_id, name, slug) values
(6, 'Puerto Plata', 'puerto-plata'),
(6, 'Imbert', 'imbert'),
(6, 'Luperón', 'luperon')
on conflict do nothing;

-- San Cristóbal
insert into municipalities (province_id, name, slug) values
(7, 'San Cristóbal', 'san-cristobal'),
(7, 'San José de Ocoa', 'san-jose-de-oca'),
(7, 'Elias Piña', 'elias-pina')
on conflict do nothing;

-- Higüey
insert into municipalities (province_id, name, slug) values
(8, 'Higüey', 'higuey'),
(8, 'Pantoja', 'pantoja')
on conflict do nothing;

-- La Romana
insert into municipalities (province_id, name, slug) values
(9, 'La Romana', 'la-romana'),
(9, 'Bayahíbe', 'bayahibe')
on conflict do nothing;

-- Samaná
insert into municipalities (province_id, name, slug) values
(10, 'Samaná', 'samana'),
(10, 'El Portillo', 'el-portillo')
on conflict do nothing;
