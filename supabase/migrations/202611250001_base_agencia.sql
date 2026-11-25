-- valentin.dev: base de la agencia (consultas de la web + CRM mínimo + outbound + muestras).
-- Solo el servidor accede (service role). RLS activada y SIN políticas públicas: el navegador nunca toca estas tablas.

create extension if not exists pgcrypto;

create table if not exists public.contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  empresa text,
  email text,
  telefono text,
  rubro text,
  ciudad text,
  web text,
  instagram text,
  origen text not null default 'manual' check (origen in ('web','manual','outbound','referido')),
  estado text not null default 'nuevo' check (estado in ('nuevo','contactado','muestra_enviada','propuesta','senia','entregado','perdido')),
  valor_usd integer check (valor_usd is null or valor_usd >= 0),
  estado_at timestamptz not null default now(),
  creado_at timestamptz not null default now(),
  actualizado_at timestamptz not null default now()
);
create unique index if not exists contactos_email_uq on public.contactos (lower(email)) where email is not null;
create index if not exists contactos_estado_idx on public.contactos (estado, actualizado_at desc);

create table if not exists public.consultas (
  id uuid primary key default gen_random_uuid(),
  contacto_id uuid references public.contactos(id) on delete set null,
  nombre text not null,
  email text,
  telefono text,
  tipo text not null check (tipo in ('landing','web','sistema','no-se')),
  mensaje text not null default '',
  origen text not null default '/',
  avisada boolean not null default false,
  creado_at timestamptz not null default now()
);
create index if not exists consultas_creado_idx on public.consultas (creado_at desc);

create table if not exists public.notas (
  id uuid primary key default gen_random_uuid(),
  contacto_id uuid not null references public.contactos(id) on delete cascade,
  texto text not null check (length(texto) between 1 and 4000),
  creado_at timestamptz not null default now()
);
create index if not exists notas_contacto_idx on public.notas (contacto_id, creado_at desc);

create table if not exists public.acciones (
  id uuid primary key default gen_random_uuid(),
  contacto_id uuid not null references public.contactos(id) on delete cascade,
  texto text not null check (length(texto) between 1 and 500),
  vence_el date not null,
  hecha boolean not null default false,
  hecha_at timestamptz,
  creado_at timestamptz not null default now()
);
create index if not exists acciones_pend_idx on public.acciones (vence_el) where hecha = false;

-- Lista de bajas: a quien está acá NO se le escribe nunca más (ver outbound/README.md).
create table if not exists public.bajas (
  email text primary key check (email = lower(email)),
  motivo text,
  creado_at timestamptz not null default now()
);

-- Registro de envíos de outbound: de acá sale el tope diario.
create table if not exists public.envios (
  id uuid primary key default gen_random_uuid(),
  contacto_id uuid references public.contactos(id) on delete set null,
  canal text not null check (canal in ('mail','whatsapp')),
  tipo text not null check (tipo in ('frio','seguimiento','respuesta','prueba')),
  destino text not null,
  asunto text,
  estado text not null default 'enviado' check (estado in ('enviado','error','rebotado')),
  creado_at timestamptz not null default now()
);
create index if not exists envios_dia_idx on public.envios (creado_at desc);

-- Muestras para clientes (/demo/[slug]): datos del negocio en JSON, la página se arma al pedirla.
create table if not exists public.muestras (
  slug text primary key check (slug ~ '^[a-z0-9][a-z0-9-]{1,60}$'),
  datos jsonb not null,
  contacto_id uuid references public.contactos(id) on delete set null,
  vistas integer not null default 0,
  creado_at timestamptz not null default now()
);

-- Interruptores y valores chicos (rutinas apagadas/prendidas, etc.).
create table if not exists public.ajustes (
  clave text primary key,
  valor jsonb not null,
  actualizado_at timestamptz not null default now()
);

create or replace function public.tocar_actualizado() returns trigger language plpgsql as $$
begin
  new.actualizado_at = now();
  if tg_table_name = 'contactos' and new.estado is distinct from old.estado then new.estado_at = now(); end if;
  return new;
end $$;

drop trigger if exists contactos_tocar on public.contactos;
create trigger contactos_tocar before update on public.contactos
  for each row execute function public.tocar_actualizado();

alter table public.contactos enable row level security;
alter table public.consultas enable row level security;
alter table public.notas enable row level security;
alter table public.acciones enable row level security;
alter table public.bajas enable row level security;
alter table public.envios enable row level security;
alter table public.muestras enable row level security;
alter table public.ajustes enable row level security;
