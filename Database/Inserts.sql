-- ============================================================
-- Inserts.sql
-- Datos iniciales para el sistema de registro vehicular
-- ============================================================

-- Tipos de uso
INSERT INTO public.tipo_uso (nombre) VALUES
  ('Particular'),
  ('Comercial'),
  ('Alquiler'),
  ('Transporte Público')
ON CONFLICT (nombre) DO NOTHING;

-- Colores
INSERT INTO public.color (nombre) VALUES
  ('Blanco'),
  ('Negro'),
  ('Rojo'),
  ('Azul'),
  ('Plata'),
  ('Gris'),
  ('Verde'),
  ('Amarillo')
ON CONFLICT (nombre) DO NOTHING;

-- Marcas
INSERT INTO public.marca (nombre) VALUES
  ('Toyota'),
  ('Honda'),
  ('Ford'),
  ('Nissan'),
  ('Mazda')
ON CONFLICT (nombre) DO NOTHING;

-- Líneas / Estilos (dependen de las marcas insertadas arriba)
INSERT INTO public.linea_estilo (id_marca, nombre) VALUES
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Toyota'), 'Corolla'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Toyota'), 'Yaris'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Toyota'), 'Hilux'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Toyota'), 'RAV4'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Honda'),  'Civic'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Honda'),  'CR-V'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Honda'),  'Fit'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Honda'),  'HR-V'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Ford'),   'Ranger'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Ford'),   'Escape'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Ford'),   'Focus'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Ford'),   'Mustang'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Nissan'), 'Sentra'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Nissan'), 'Versa'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Nissan'), 'Frontier'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Nissan'), 'Kicks'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Mazda'),  'Mazda3'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Mazda'),  'CX-5'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Mazda'),  'BT-50'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Mazda'),  'Mazda2');

-- Usuario administrador por defecto
INSERT INTO public.usuario (username, password_hash, rol) VALUES
  ('admin', 'admin123', 'ADMIN')
ON CONFLICT (username) DO NOTHING;
