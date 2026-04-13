-- Run this in your Supabase SQL editor

create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  images text[] default '{}',
  is_live boolean default false,
  category text,
  created_at timestamp with time zone default now()
);

-- Allow public read of live products only
create policy "Public can view live products"
  on products for select
  using (is_live = true);

-- Only authenticated user (you) can do everything
create policy "Admin full access"
  on products for all
  using (auth.role() = 'authenticated');

alter table products enable row level security;

-- Storage bucket for product images
insert into storage.buckets (id, name, public) values ('products', 'products', true);

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "Admin can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'products' and auth.role() = 'authenticated');

create policy "Admin can delete product images"
  on storage.objects for delete
  using (bucket_id = 'products' and auth.role() = 'authenticated');
