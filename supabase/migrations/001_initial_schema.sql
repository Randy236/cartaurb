-- CartaJuliaca — esquema inicial (ejecutar en Supabase SQL Editor o como migración)

create extension if not exists "pgcrypto";

-- Tabla restaurantes
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  address text not null default '',
  reference text,
  maps_url text,
  tiktok_url text,
  cover_image text,
  rating numeric(2,1) default 4.5 check (rating >= 0 and rating <= 5),
  created_at timestamptz default now()
);

-- Imágenes de carta
create table if not exists public.menu_images (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- Emails con acceso al panel (debe coincidir con Supabase Auth)
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

-- Visitas (métricas)
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants (id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_menu_images_restaurant on public.menu_images (restaurant_id);
create index if not exists idx_visits_restaurant on public.visits (restaurant_id);
create index if not exists idx_restaurants_created on public.restaurants (created_at desc);

-- Función: ¿usuario autenticado es admin?
create or replace function public.is_admin ()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.restaurants enable row level security;
alter table public.menu_images enable row level security;
alter table public.admin_users enable row level security;
alter table public.visits enable row level security;

-- Lectura pública restaurantes e imágenes
drop policy if exists "Public read restaurants" on public.restaurants;
create policy "Public read restaurants" on public.restaurants for select using (true);

drop policy if exists "Public read menu_images" on public.menu_images;
create policy "Public read menu_images" on public.menu_images for select using (true);

-- Visitas: cualquiera puede registrar; solo admin lee
drop policy if exists "Anyone insert visits" on public.visits;
create policy "Anyone insert visits" on public.visits for insert with check (true);

drop policy if exists "Admin read visits" on public.visits;
create policy "Admin read visits" on public.visits for select using (public.is_admin ());

-- Escritura restaurantes (solo admin)
drop policy if exists "Admin insert restaurants" on public.restaurants;
create policy "Admin insert restaurants" on public.restaurants for insert with check (public.is_admin ());

drop policy if exists "Admin update restaurants" on public.restaurants;
create policy "Admin update restaurants" on public.restaurants for update using (public.is_admin ());

drop policy if exists "Admin delete restaurants" on public.restaurants;
create policy "Admin delete restaurants" on public.restaurants for delete using (public.is_admin ());

-- menu_images CRUD admin
drop policy if exists "Admin insert menu_images" on public.menu_images;
create policy "Admin insert menu_images" on public.menu_images for insert with check (public.is_admin ());

drop policy if exists "Admin update menu_images" on public.menu_images;
create policy "Admin update menu_images" on public.menu_images for update using (public.is_admin ());

drop policy if exists "Admin delete menu_images" on public.menu_images;
create policy "Admin delete menu_images" on public.menu_images for delete using (public.is_admin ());

-- admin_users: sin acceso desde el cliente (gestionar solo por SQL)
drop policy if exists "No client access admin_users" on public.admin_users;
create policy "No client access admin_users" on public.admin_users for all using (false);

-- Bucket de almacenamiento (crear bucket "restaurant-media" como público en el panel si no existe)
insert into storage.buckets (id, name, public)
values ('restaurant-media', 'restaurant-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read restaurant-media" on storage.objects;
create policy "Public read restaurant-media" on storage.objects for select using (bucket_id = 'restaurant-media');

drop policy if exists "Admin upload restaurant-media" on storage.objects;
create policy "Admin upload restaurant-media" on storage.objects for insert
with check (bucket_id = 'restaurant-media' and public.is_admin ());

drop policy if exists "Admin update restaurant-media" on storage.objects;
create policy "Admin update restaurant-media" on storage.objects for update
using (bucket_id = 'restaurant-media' and public.is_admin ());

drop policy if exists "Admin delete restaurant-media" on storage.objects;
create policy "Admin delete restaurant-media" on storage.objects for delete
using (bucket_id = 'restaurant-media' and public.is_admin ());

-- Permitir comprobar rol admin desde el cliente autenticado
grant execute on function public.is_admin () to authenticated;

-- Tras ejecutar: insertar tu email admin, ej.:
-- insert into public.admin_users (email) values ('tu@email.com');
