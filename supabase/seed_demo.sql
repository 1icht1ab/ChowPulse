-- =====================================================================
-- ChowPulse · Seed de datos demo para TU usuario
-- ---------------------------------------------------------------------
-- REQUISITO: regístrate primero en la app (eso crea tu fila en auth.users
--            y, vía el trigger handle_new_user, tu hogar + membresía owner).
-- USO:       edita v_email abajo con TU correo y ejecútalo en el
--            SQL Editor de Supabase. Es idempotente (puedes re-ejecutarlo).
-- =====================================================================
do $$
declare
  v_email text := 'TU_EMAIL_AQUI@ejemplo.com';   -- <<< EDITA ESTO
  v_user  uuid;
  hh1     uuid;  -- Familia Tönnies (owner)
  hh2     uuid;  -- Casa de la Abuela (caregiver)
  p_luna  uuid;
  p_mochi uuid;
  p_kappa uuid;
  p_toby  uuid;
begin
  select id into v_user from auth.users where email = v_email;
  if v_user is null then
    raise exception 'No existe usuario con email %. Regístrate primero en la app.', v_email;
  end if;

  -- Hogar 1: reutiliza el que creó el trigger al registrarte (o créalo).
  select h.id into hh1
  from public.households h
  join public.household_members m on m.household_id = h.id
  where m.user_id = v_user and m.role = 'owner'
  order by h.created_at
  limit 1;

  if hh1 is null then
    insert into public.households (name, created_by) values ('Familia Tönnies', v_user) returning id into hh1;
    insert into public.household_members (household_id, user_id, role) values (hh1, v_user, 'owner');
  else
    update public.households set name = 'Familia Tönnies' where id = hh1;
  end if;

  -- Hogar 2 (demuestra el switcher + rol caregiver). Idempotente: recrea.
  delete from public.households where created_by = v_user and name = 'Casa de la Abuela';
  insert into public.households (name, created_by) values ('Casa de la Abuela', v_user) returning id into hh2;
  insert into public.household_members (household_id, user_id, role) values (hh2, v_user, 'caregiver');

  -- Limpia mascotas demo previas (cascada a dietas/vacunas/entrenamiento).
  delete from public.pets where household_id in (hh1, hh2);

  -- Mascotas. species debe ser del enum pet_species (turtle -> 'reptile').
  -- public_slug se autogenera por trigger cuando is_public = true.
  insert into public.pets (household_id, name, species, breed, sex, birth_date, bio, avatar_url, is_public, created_by)
  values (hh1, 'Luna', 'dog', 'Border Collie', 'female', '2021-04-10',
          'Border Collie incansable. Le encanta el frisbee y vigilar el jardín.',
          'https://placedog.net/640/512?id=7', true, v_user)
  returning id into p_luna;

  insert into public.pets (household_id, name, species, breed, sex, birth_date, bio, avatar_url, is_public, created_by)
  values (hh1, 'Mochi', 'cat', 'Británico de pelo corto', 'male', '2022-09-01',
          'Gato filósofo. Experto en siestas al sol.',
          'https://cataas.com/cat?width=640&height=512', false, v_user)
  returning id into p_mochi;

  insert into public.pets (household_id, name, species, breed, sex, birth_date, bio, is_public, created_by)
  values (hh1, 'Kappa', 'reptile', 'Tortuga de orejas rojas', 'unknown', '2019-06-20',
          'Lenta pero firme. Toma el sol sobre su roca.', true, v_user)
  returning id into p_kappa;

  insert into public.pets (household_id, name, species, breed, sex, birth_date, bio, avatar_url, is_public, created_by)
  values (hh2, 'Toby', 'dog', 'Mestizo', 'male', '2018-01-15',
          'El abuelo del barrio. Tranquilo, sabio y siempre listo para una caricia.',
          'https://placedog.net/640/512?id=12', false, v_user)
  returning id into p_toby;

  -- Dietas activas (1 por mascota; enum diet_type).
  insert into public.diets (pet_id, type, daily_grams, meals_per_day, is_active, created_by) values
    (p_luna,  'barf',     480, 2, true, v_user),
    (p_mochi, 'mixed',    260, 2, true, v_user),
    (p_kappa, 'homemade',  20, 1, true, v_user),
    (p_toby,  'kibble',   300, 2, true, v_user);

  -- Vacunas (cada inserción genera su recordatorio vía trigger).
  insert into public.vaccinations (pet_id, vaccine_name, administered_on, next_due_on, vet_name, created_by) values
    (p_luna, 'Polivalente', date '2025-06-20', current_date + 5,  'Clínica El Médano', v_user),
    (p_toby, 'Antirrábica',  date '2024-07-01', current_date + 40, 'Clínica El Médano', v_user);

  -- Entrenamiento (trucos; algunos públicos para el perfil compartible).
  insert into public.training_goals (pet_id, skill, status, progress, is_public, created_by) values
    (p_luna, 'Sentarse',    'mastered',    100, true,  v_user),
    (p_luna, 'Dar la pata', 'mastered',    100, true,  v_user),
    (p_luna, 'Rodar',       'in_progress',  60, true,  v_user),
    (p_toby, 'Tumbarse',    'mastered',    100, false, v_user);

  raise notice 'Seed OK para % — hogares % y %', v_email, hh1, hh2;
end $$;
