-- =====================================================================
-- ChowPulse · Endurecimiento de funciones (advisors de seguridad de Supabase)
-- =====================================================================

-- 1) search_path fijo (lint: function_search_path_mutable)
alter function public.age_in_years(date) set search_path = '';
alter function public.gen_public_slug() set search_path = extensions, public;

-- 2) Funciones de TRIGGER: no deben exponerse como RPC en la API.
--    Los triggers se ejecutan sin requerir EXECUTE del usuario invocador,
--    así que revocar el acceso público NO afecta su funcionamiento.
revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon, authenticated;
revoke all on function public.vaccination_to_reminder() from public;
revoke all on function public.vaccination_to_reminder() from anon, authenticated;
revoke all on function public.gen_public_slug() from public;
revoke all on function public.gen_public_slug() from anon, authenticated;

-- Nota: las funciones helper (is_household_member, household_role, can_view_pet,
-- can_edit_pet) se mantienen ejecutables a propósito: la RLS las invoca como el
-- rol que consulta y solo revelan la membresía del propio usuario (auth.uid()).
