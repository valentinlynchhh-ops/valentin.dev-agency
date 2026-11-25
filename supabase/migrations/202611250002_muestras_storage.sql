-- Bucket privado para las fotos de las muestras. Solo el servidor (service role) lo toca; se sirve por /demo/img/<hash>.webp.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('muestras', 'muestras', false, 8388608, array['image/webp'])
on conflict (id) do nothing;
