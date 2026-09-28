create extension if not exists "pgcrypto";

create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null, phone text not null, note text,
  created_at timestamptz default now()
);
create table pets (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers on delete cascade,
  name text not null, species text default 'dog', breed text,
  weight_kg numeric, coat_notes text, created_at timestamptz default now()
);
create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null, price numeric not null, duration_min int default 60, active boolean default true
);
create table grooming_styles (
  id uuid primary key default gen_random_uuid(),
  name text not null, species text default 'dog', extra_price numeric default 0
);
create table bookings (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets on delete cascade,
  service_id uuid references services,
  style_id uuid references grooming_styles,
  scheduled_at timestamptz not null,
  status text not null default 'booked'
    check (status in ('booked','waiting','bathing','grooming','done','paid')),
  groomer_brief text,
  reference_urls text[] default '{}',
  price numeric default 0,
  created_at timestamptz default now()
);
create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings,
  amount numeric not null,
  method text check (method in ('cash','transfer','card')),
  paid_at timestamptz default now()
);
create table notifications (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings on delete cascade,
  message text not null, read boolean default false,
  created_at timestamptz default now()
);

-- แจ้งเตือนอัตโนมัติเมื่องานเสร็จ
create function notify_done() returns trigger language plpgsql as $$
begin
  if new.status = 'done' and old.status <> 'done' then
    insert into notifications (booking_id, message)
    select new.id, 'งานของ ' || p.name || ' เสร็จแล้ว พร้อมรับกลับบ้าน'
    from pets p where p.id = new.pet_id;
  end if;
  return new;
end $$;
create trigger trg_notify_done after update on bookings
  for each row execute function notify_done();

-- ช่วงพัฒนา: เปิดสิทธิ์ทั้งผู้ล็อกอินและ anon (ลบ dev_anon ก่อนขึ้นใช้งานจริง)
do $$ declare t text; begin
  foreach t in array array['customers','pets','services','grooming_styles','bookings','payments','notifications'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "staff_all" on %I for all to authenticated using (true) with check (true)', t);
    execute format('create policy "dev_anon" on %I for all to anon using (true) with check (true)', t);
  end loop;
end $$;

insert into services (name, price, duration_min) values
  ('อาบน้ำ', 300, 60), ('ตัดขน', 500, 90), ('อาบน้ำ + ตัดขน', 700, 120);
insert into grooming_styles (name, extra_price) values
  ('ตัดสั้นเกรียน', 0), ('ทรงหมีเท็ดดี้', 100), ('ทรงมาตรฐานสายพันธุ์', 150);

insert into storage.buckets (id, name, public) values ('references','references', true)
  on conflict do nothing;
