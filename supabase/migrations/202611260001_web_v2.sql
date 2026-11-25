-- Web v2: reuniones y cotizaciones como consultas, programa de vendedores y seguimiento por código.

-- Tipos de consulta nuevos + detalle estructurado + código de vendedor que la originó.
alter table public.consultas drop constraint if exists consultas_tipo_check;
alter table public.consultas add constraint consultas_tipo_check check (tipo in ('landing','web','sistema','no-se','reunion','cotizacion'));
alter table public.consultas add column if not exists detalle jsonb;
alter table public.consultas add column if not exists ref text check (ref is null or ref ~ '^[A-HJ-NP-Z2-9]{6}$');
alter table public.contactos add column if not exists vendedor_ref text check (vendedor_ref is null or vendedor_ref ~ '^[A-HJ-NP-Z2-9]{6}$');
create index if not exists contactos_vendedor_idx on public.contactos (vendedor_ref) where vendedor_ref is not null;

-- Postulaciones al programa de vendedores. El código se genera al aprobar (desde /admin/vendedores).
create table if not exists public.postulaciones_vendedores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text,
  telefono text,
  motivo text not null check (length(motivo) between 10 and 1500),
  estado text not null default 'nueva' check (estado in ('nueva','aprobada','rechazada')),
  codigo text unique check (codigo is null or codigo ~ '^[A-HJ-NP-Z2-9]{6}$'),
  creado_at timestamptz not null default now(),
  resuelta_at timestamptz,
  check (email is not null or telefono is not null)
);
create index if not exists postulaciones_estado_idx on public.postulaciones_vendedores (estado, creado_at desc);
alter table public.postulaciones_vendedores enable row level security;
