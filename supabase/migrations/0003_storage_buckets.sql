-- =====================================================================
-- ChowPulse · Buckets de Storage (idempotente)
--   · pet-photos    -> público (avatares y galería; URLs no adivinables)
--   · pet-documents -> privado (adjuntos médicos)
-- Las políticas de acceso están en 0001 (sección 7 / 0002 no las toca).
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('pet-photos', 'pet-photos', true),
       ('pet-documents', 'pet-documents', false)
on conflict (id) do nothing;
