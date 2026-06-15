-- =====================================================================
-- MASCOTARIO · Esquema inicial (Supabase / PostgreSQL)
-- Módulos:
--   1. Identidad & Hogares (usuarios + roles para compartir en familia)
--   2. Mascotas & Fotos
--   3. Dietas & Recetas (BARF / kibble / mixta · porciones · recetas)
--   4. Historial médico & Recordatorios (vacunas, refuerzos)
--   5. Entrenamiento (objetivos + sesiones)
--   6. Perfiles públicos de solo lectura
-- Convenciones: snake_case, uuid PK, timestamptz, RLS en TODAS las tablas.
-- =====================================================================

-- ---------- Extensiones ----------
create extension if not exists pgcrypto      with schema extensions;  -- gen_random_uuid / gen_random_bytes
create extension if not exists moddatetime   with schema extensions;  -- triggers updated_at

-- ---------- Tipos enumerados ----------
-- El orden define la jerarquía de permisos: viewer < caregiver < owner
create type public.member_role     as enum ('viewer', 'caregiver', 'owner');
create type public.pet_species     as enum ('dog','cat','bird','rabbit','reptile','fish','rodent','horse','other');
create type public.pet_sex         as enum ('male','female','unknown');
create type public.diet_type       as enum ('barf','kibble','wet','homemade','mixed');
create type public.medical_type    as enum ('vaccine','deworming','checkup','surgery','illness','allergy','medication','lab_result','weight','other');
create type public.reminder_status as enum ('pending','sent','done','cancelled');
create type public.training_status as enum ('not_started','in_progress','mastered');


-- =====================================================================
-- 1. IDENTIDAD & HOGARES
-- =====================================================================

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  locale      text not null default 'es',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.households (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_by  uuid not null references auth.users(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Tabla puente usuario <-> hogar con rol (núcleo de la compartición familiar)
create table public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         public.member_role not null default 'caregiver',
  joined_at    timestamptz not null default now(),
  primary key (household_id, user_id)
);
create index idx_household_members_user on public.household_members(user_id);

-- Invitaciones por email para sumar familiares
create table public.household_invitations (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  email        text not null,
  role         public.member_role not null default 'viewer',
  token        uuid not null default gen_random_uuid(),
  invited_by   uuid not null references auth.users(id),
  accepted_at  timestamptz,
  expires_at   timestamptz not null default (now() + interval '14 days'),
  created_at   timestamptz not null default now()
);
create index idx_invitations_household on public.household_invitations(household_id);


-- =====================================================================
-- 2. MASCOTAS & FOTOS
-- =====================================================================

create table public.pets (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name         text not null,
  species      public.pet_species not null,
  breed        text,
  sex          public.pet_sex not null default 'unknown',
  birth_date   date,                       -- la edad se CALCULA, no se almacena
  is_neutered  boolean,
  weight_kg    numeric(6,2),
  microchip    text,
  color        text,
  bio          text,                        -- texto libre, apto para perfil público
  avatar_url   text,                        -- foto principal (URL de Storage)
  -- Perfil público
  is_public            boolean not null default false,
  public_slug          text unique,         -- token NO adivinable para la URL pública
  public_show_training boolean not null default true,
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index idx_pets_household on public.pets(household_id);

-- La edad se deriva de birth_date (nunca se guarda un número que envejece solo)
create or replace function public.age_in_years(_birth date)
returns integer language sql stable as $$
  select case when _birth is null then null
              else extract(year from age(_birth))::int end;
$$;

create table public.pet_photos (
  id           uuid primary key default gen_random_uuid(),
  pet_id       uuid not null references public.pets(id) on delete cascade,
  storage_path text not null,               -- ruta dentro del bucket de Storage
  url          text,                         -- URL pública/firmada cacheada
  caption      text,
  is_primary   boolean not null default false,
  sort_order   int not null default 0,
  uploaded_by  uuid references auth.users(id),
  created_at   timestamptz not null default now()
);
create index idx_pet_photos_pet on public.pet_photos(pet_id);


-- =====================================================================
-- 3. DIETAS & RECETAS
-- =====================================================================

-- Recetas a nivel de hogar (reutilizables entre mascotas)
create table public.recipes (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name         text not null,
  description  text,
  instructions text,
  diet_type    public.diet_type,
  total_grams  numeric(8,2),
  kcal         numeric(8,2),
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index idx_recipes_household on public.recipes(household_id);

create table public.recipe_ingredients (
  id         uuid primary key default gen_random_uuid(),
  recipe_id  uuid not null references public.recipes(id) on delete cascade,
  name       text not null,
  grams      numeric(8,2),
  notes      text,
  sort_order int not null default 0
);
create index idx_recipe_ingredients_recipe on public.recipe_ingredients(recipe_id);

-- Plan de dieta por mascota (BARF / kibble / mixta, gramos, comidas por día)
create table public.diets (
  id            uuid primary key default gen_random_uuid(),
  pet_id        uuid not null references public.pets(id) on delete cascade,
  type          public.diet_type not null,
  daily_grams   numeric(8,2),
  meals_per_day smallint default 2,
  kcal_per_day  numeric(8,2),
  notes         text,
  is_active     boolean not null default true,
  start_date    date not null default current_date,
  end_date      date,
  created_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_diets_pet on public.diets(pet_id);
-- Sólo UNA dieta activa por mascota a la vez
create unique index uq_one_active_diet_per_pet on public.diets(pet_id) where is_active;

-- Comidas de la dieta: porción + receta opcional + horario
create table public.diet_meals (
  id            uuid primary key default gen_random_uuid(),
  diet_id       uuid not null references public.diets(id) on delete cascade,
  recipe_id     uuid references public.recipes(id) on delete set null,
  label         text,                       -- 'Desayuno', 'Cena'...
  time_of_day   time,
  portion_grams numeric(8,2),
  sort_order    int not null default 0
);
create index idx_diet_meals_diet on public.diet_meals(diet_id);


-- =====================================================================
-- 4. HISTORIAL MÉDICO & RECORDATORIOS
-- =====================================================================

create table public.medical_records (
  id             uuid primary key default gen_random_uuid(),
  pet_id         uuid not null references public.pets(id) on delete cascade,
  type           public.medical_type not null,
  title          text not null,
  description    text,
  occurred_on    date not null default current_date,
  vet_name       text,
  clinic         text,
  cost           numeric(10,2),
  attachment_url text,                       -- PDF/imagen en bucket privado
  data           jsonb not null default '{}'::jsonb,  -- campos específicos (dosis, peso...)
  created_by     uuid references auth.users(id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index idx_medical_pet      on public.medical_records(pet_id);
create index idx_medical_pet_type on public.medical_records(pet_id, type);

-- Vacunas con fecha de refuerzo (genera recordatorio automáticamente)
create table public.vaccinations (
  id                uuid primary key default gen_random_uuid(),
  pet_id            uuid not null references public.pets(id) on delete cascade,
  medical_record_id uuid references public.medical_records(id) on delete set null,
  vaccine_name      text not null,
  administered_on   date not null,
  next_due_on       date,
  lot_number        text,
  vet_name          text,
  created_by        uuid references auth.users(id),
  created_at        timestamptz not null default now()
);
create index idx_vax_pet      on public.vaccinations(pet_id);
create index idx_vax_due       on public.vaccinations(next_due_on);

create table public.reminders (
  id           uuid primary key default gen_random_uuid(),
  pet_id       uuid not null references public.pets(id) on delete cascade,
  title        text not null,
  notes        text,
  category     public.medical_type,
  due_at       timestamptz not null,
  remind_at    timestamptz,                  -- cuándo notificar (antes de due_at)
  recurrence   text,                          -- RRULE iCal o 'yearly' / 'monthly'
  status       public.reminder_status not null default 'pending',
  source_table text,                          -- 'vaccinations' si es automático
  source_id    uuid,
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now()
);
create index idx_reminders_pet    on public.reminders(pet_id);
create index idx_reminders_due     on public.reminders(status, remind_at);


-- =====================================================================
-- 5. ENTRENAMIENTO
-- =====================================================================

create table public.training_goals (
  id         uuid primary key default gen_random_uuid(),
  pet_id     uuid not null references public.pets(id) on delete cascade,
  skill      text not null,                  -- 'Sentarse', 'Quieto', 'Venir'
  category   text,                            -- obediencia, agilidad, trucos
  status     public.training_status not null default 'not_started',
  progress   smallint not null default 0 check (progress between 0 and 100),
  notes      text,
  is_public  boolean not null default false,  -- mostrar como logro en perfil público
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_training_goals_pet on public.training_goals(pet_id);

create table public.training_sessions (
  id           uuid primary key default gen_random_uuid(),
  pet_id       uuid not null references public.pets(id) on delete cascade,
  goal_id      uuid references public.training_goals(id) on delete set null,
  session_date date not null default current_date,
  duration_min int,
  rating       smallint check (rating between 1 and 5),
  notes        text,
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now()
);
create index idx_training_sessions_pet on public.training_sessions(pet_id);


-- =====================================================================
-- FUNCIONES AUXILIARES (SECURITY DEFINER -> evitan recursión en RLS)
-- =====================================================================

-- Rol del usuario actual en un hogar (NULL si no es miembro)
create or replace function public.household_role(_household_id uuid)
returns public.member_role
language sql stable security definer set search_path = public as $$
  select role from public.household_members
  where household_id = _household_id and user_id = auth.uid();
$$;

create or replace function public.is_household_member(_household_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.household_members
    where household_id = _household_id and user_id = auth.uid()
  );
$$;

-- ¿Puede VER esta mascota? (cualquier miembro del hogar)
create or replace function public.can_view_pet(_pet_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.pets p
    join public.household_members m on m.household_id = p.household_id
    where p.id = _pet_id and m.user_id = auth.uid()
  );
$$;

-- ¿Puede EDITAR esta mascota? (caregiver u owner)
create or replace function public.can_edit_pet(_pet_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.pets p
    join public.household_members m on m.household_id = p.household_id
    where p.id = _pet_id and m.user_id = auth.uid() and m.role >= 'caregiver'
  );
$$;


-- =====================================================================
-- TRIGGERS
-- =====================================================================

-- updated_at automático
create trigger t_profiles_updated   before update on public.profiles        for each row execute function extensions.moddatetime(updated_at);
create trigger t_households_updated  before update on public.households       for each row execute function extensions.moddatetime(updated_at);
create trigger t_pets_updated        before update on public.pets            for each row execute function extensions.moddatetime(updated_at);
create trigger t_recipes_updated     before update on public.recipes         for each row execute function extensions.moddatetime(updated_at);
create trigger t_diets_updated       before update on public.diets           for each row execute function extensions.moddatetime(updated_at);
create trigger t_medical_updated     before update on public.medical_records for each row execute function extensions.moddatetime(updated_at);
create trigger t_training_updated    before update on public.training_goals  for each row execute function extensions.moddatetime(updated_at);

-- Al registrarse un usuario: crear perfil + hogar por defecto + membresía owner
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare new_household uuid;
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id,
          new.raw_user_meta_data->>'full_name',
          new.raw_user_meta_data->>'avatar_url');

  insert into public.households (name, created_by)
  values (coalesce(new.raw_user_meta_data->>'full_name', 'Mi') || ' · Familia', new.id)
  returning id into new_household;

  insert into public.household_members (household_id, user_id, role)
  values (new_household, new.id, 'owner');

  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Generar slug público no adivinable cuando se marca is_public
create or replace function public.gen_public_slug()
returns trigger language plpgsql as $$
begin
  if new.is_public and new.public_slug is null then
    new.public_slug := replace(replace(replace(
      encode(gen_random_bytes(9), 'base64'), '/', '_'), '+', '-'), '=', '');
  end if;
  return new;
end;
$$;
create trigger t_pets_public_slug
  before insert or update of is_public on public.pets
  for each row execute function public.gen_public_slug();

-- Crear recordatorio de refuerzo automáticamente al registrar una vacuna
create or replace function public.vaccination_to_reminder()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.next_due_on is not null then
    insert into public.reminders (pet_id, title, category, due_at, remind_at, status, source_table, source_id, created_by)
    values (new.pet_id,
            'Refuerzo de vacuna: ' || new.vaccine_name,
            'vaccine',
            new.next_due_on::timestamptz,
            (new.next_due_on - interval '7 days')::timestamptz,
            'pending', 'vaccinations', new.id, new.created_by);
  end if;
  return new;
end;
$$;
create trigger t_vax_reminder
  after insert on public.vaccinations
  for each row execute function public.vaccination_to_reminder();


-- =====================================================================
-- RLS · ROW LEVEL SECURITY
-- =====================================================================

alter table public.profiles              enable row level security;
alter table public.households            enable row level security;
alter table public.household_members     enable row level security;
alter table public.household_invitations enable row level security;
alter table public.pets                  enable row level security;
alter table public.pet_photos            enable row level security;
alter table public.recipes               enable row level security;
alter table public.recipe_ingredients    enable row level security;
alter table public.diets                 enable row level security;
alter table public.diet_meals            enable row level security;
alter table public.medical_records       enable row level security;
alter table public.vaccinations          enable row level security;
alter table public.reminders             enable row level security;
alter table public.training_goals        enable row level security;
alter table public.training_sessions     enable row level security;

-- profiles: cada quien gestiona el suyo
create policy profiles_select on public.profiles for select using (id = auth.uid());
create policy profiles_update on public.profiles for update using (id = auth.uid());

-- households
create policy households_select on public.households for select using (public.is_household_member(id));
create policy households_insert on public.households for insert with check (created_by = auth.uid());
create policy households_update on public.households for update using (public.household_role(id) = 'owner');
create policy households_delete on public.households for delete using (public.household_role(id) = 'owner');

-- household_members: miembros leen; sólo owner administra
create policy members_select on public.household_members for select using (public.is_household_member(household_id));
create policy members_manage on public.household_members for all
  using (public.household_role(household_id) = 'owner')
  with check (public.household_role(household_id) = 'owner');

-- invitaciones: owner/caregiver gestionan
create policy invitations_manage on public.household_invitations for all
  using (public.household_role(household_id) >= 'caregiver')
  with check (public.household_role(household_id) >= 'caregiver');

-- pets
create policy pets_select on public.pets for select using (public.is_household_member(household_id));
create policy pets_insert on public.pets for insert with check (public.household_role(household_id) >= 'caregiver');
create policy pets_update on public.pets for update using (public.household_role(household_id) >= 'caregiver');
create policy pets_delete on public.pets for delete using (public.household_role(household_id) = 'owner');

-- Tablas hijas por mascota: ver = miembro, editar = caregiver+
create policy photos_select   on public.pet_photos       for select using (public.can_view_pet(pet_id));
create policy photos_write    on public.pet_photos       for all    using (public.can_edit_pet(pet_id)) with check (public.can_edit_pet(pet_id));
create policy diets_select    on public.diets            for select using (public.can_view_pet(pet_id));
create policy diets_write     on public.diets            for all    using (public.can_edit_pet(pet_id)) with check (public.can_edit_pet(pet_id));
create policy medical_select  on public.medical_records  for select using (public.can_view_pet(pet_id));
create policy medical_write   on public.medical_records  for all    using (public.can_edit_pet(pet_id)) with check (public.can_edit_pet(pet_id));
create policy vax_select      on public.vaccinations     for select using (public.can_view_pet(pet_id));
create policy vax_write       on public.vaccinations     for all    using (public.can_edit_pet(pet_id)) with check (public.can_edit_pet(pet_id));
create policy reminders_select on public.reminders       for select using (public.can_view_pet(pet_id));
create policy reminders_write  on public.reminders       for all    using (public.can_edit_pet(pet_id)) with check (public.can_edit_pet(pet_id));
create policy goals_select    on public.training_goals   for select using (public.can_view_pet(pet_id));
create policy goals_write     on public.training_goals   for all    using (public.can_edit_pet(pet_id)) with check (public.can_edit_pet(pet_id));
create policy sessions_select on public.training_sessions for select using (public.can_view_pet(pet_id));
create policy sessions_write  on public.training_sessions for all    using (public.can_edit_pet(pet_id)) with check (public.can_edit_pet(pet_id));

-- diet_meals (referencia diet -> pet)
create policy diet_meals_select on public.diet_meals for select using (
  exists (select 1 from public.diets d where d.id = diet_id and public.can_view_pet(d.pet_id)));
create policy diet_meals_write on public.diet_meals for all
  using  (exists (select 1 from public.diets d where d.id = diet_id and public.can_edit_pet(d.pet_id)))
  with check (exists (select 1 from public.diets d where d.id = diet_id and public.can_edit_pet(d.pet_id)));

-- recipes (a nivel de hogar)
create policy recipes_select on public.recipes for select using (public.is_household_member(household_id));
create policy recipes_write  on public.recipes for all
  using (public.household_role(household_id) >= 'caregiver')
  with check (public.household_role(household_id) >= 'caregiver');
create policy recipe_ing_select on public.recipe_ingredients for select using (
  exists (select 1 from public.recipes r where r.id = recipe_id and public.is_household_member(r.household_id)));
create policy recipe_ing_write on public.recipe_ingredients for all
  using  (exists (select 1 from public.recipes r where r.id = recipe_id and public.household_role(r.household_id) >= 'caregiver'))
  with check (exists (select 1 from public.recipes r where r.id = recipe_id and public.household_role(r.household_id) >= 'caregiver'));


-- =====================================================================
-- 6. PERFILES PÚBLICOS DE SOLO LECTURA
-- =====================================================================
-- Nada en las tablas base es accesible por 'anon' (RLS lo bloquea).
-- La exposición pública se hace por UNA función SECURITY DEFINER que
-- devuelve sólo campos seguros (identidad, fotos, logros). El historial
-- médico NUNCA se expone. Se accede por slug no adivinable.

create or replace function public.get_public_pet(_slug text)
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'name',       p.name,
    'species',    p.species,
    'breed',      p.breed,
    'sex',        p.sex,
    'age_years',  public.age_in_years(p.birth_date),
    'bio',        p.bio,
    'avatar_url', p.avatar_url,
    'photos', coalesce((
      select jsonb_agg(jsonb_build_object('url', ph.url, 'caption', ph.caption) order by ph.sort_order)
      from public.pet_photos ph where ph.pet_id = p.id), '[]'::jsonb),
    'skills', case when p.public_show_training then coalesce((
      select jsonb_agg(g.skill order by g.skill)
      from public.training_goals g
      where g.pet_id = p.id and g.is_public and g.status = 'mastered'), '[]'::jsonb)
      else '[]'::jsonb end
  )
  from public.pets p
  where p.public_slug = _slug and p.is_public = true;
$$;

revoke all on function public.get_public_pet(text) from public;
grant execute on function public.get_public_pet(text) to anon, authenticated;


-- =====================================================================
-- RPC: aceptar invitación a un hogar
-- =====================================================================
create or replace function public.accept_invitation(_token uuid)
returns uuid
language plpgsql security definer set search_path = public as $$
declare inv record;
begin
  select * into inv from public.household_invitations
   where token = _token and accepted_at is null and expires_at > now();
  if not found then
    raise exception 'Invitación inválida o expirada';
  end if;

  insert into public.household_members (household_id, user_id, role)
  values (inv.household_id, auth.uid(), inv.role)
  on conflict (household_id, user_id) do nothing;

  update public.household_invitations set accepted_at = now() where id = inv.id;
  return inv.household_id;
end;
$$;
grant execute on function public.accept_invitation(uuid) to authenticated;


-- =====================================================================
-- 7. STORAGE (ejecutar tras crear los buckets en el panel o por API)
--   · pet-photos     -> público (avatares y galería; URLs no adivinables)
--   · pet-documents  -> privado (adjuntos médicos)
-- Convención de ruta:  {household_id}/{pet_id}/{archivo}
-- =====================================================================
-- insert into storage.buckets (id, name, public) values
--   ('pet-photos', 'pet-photos', true),
--   ('pet-documents', 'pet-documents', false);

-- Lectura de documentos médicos: sólo miembros del hogar
create policy "docs read members" on storage.objects for select to authenticated
  using (bucket_id = 'pet-documents'
         and public.is_household_member(((storage.foldername(name))[1])::uuid));

-- Subir/editar fotos y documentos: caregiver u owner del hogar
create policy "media write caregivers" on storage.objects for insert to authenticated
  with check (bucket_id in ('pet-photos','pet-documents')
              and public.household_role(((storage.foldername(name))[1])::uuid) >= 'caregiver');

create policy "media update caregivers" on storage.objects for update to authenticated
  using (bucket_id in ('pet-photos','pet-documents')
         and public.household_role(((storage.foldername(name))[1])::uuid) >= 'caregiver');

create policy "media delete caregivers" on storage.objects for delete to authenticated
  using (bucket_id in ('pet-photos','pet-documents')
         and public.household_role(((storage.foldername(name))[1])::uuid) >= 'caregiver');
