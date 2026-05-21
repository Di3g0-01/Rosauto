-- 1. Crear tabla Color (Maestra)
CREATE TABLE IF NOT EXISTS color (
    id_color SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- (Opcional) Migrar los colores existentes en texto a la nueva tabla
INSERT INTO color (nombre) VALUES ('Blanco'), ('Negro'), ('Rojo'), ('Azul'), ('Plata'), ('Gris') ON CONFLICT DO NOTHING;

-- 2. Modificar tabla Vehiculo
-- Agregar columnas faltantes
ALTER TABLE vehiculo 
ADD COLUMN chasis VARCHAR(50) UNIQUE,
ADD COLUMN "año_modelo" INTEGER;

-- 3. Modificar tabla Tarjeta_Circulacion
-- Agregar FKs solicitadas en la rúbrica y campo de calcomania
ALTER TABLE tarjeta_circulacion
ADD COLUMN nit_cui VARCHAR(13) REFERENCES propietario(nit_cui),
ADD COLUMN id_tipo_uso INTEGER REFERENCES tipo_uso(id_tipo_uso),
ADD COLUMN id_color INTEGER REFERENCES color(id_color),
ADD COLUMN calcomania_pagada BOOLEAN DEFAULT FALSE;

-- 4. Crear tabla de Trámites (Cambio de dueño, color, etc.)
CREATE TABLE IF NOT EXISTS tramite (
    id_tramite SERIAL PRIMARY KEY,
    numero_tarjeta VARCHAR(20) NOT NULL REFERENCES tarjeta_circulacion(numero_tarjeta),
    tipo_tramite VARCHAR(50) NOT NULL, -- ej: 'Cambio de Color', 'Traspaso'
    fecha_tramite TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT
);

-- 5. Crear tabla de Historial de Motores
CREATE TABLE IF NOT EXISTS historial_motor (
    id_historial SERIAL PRIMARY KEY,
    id_vehiculo INTEGER NOT NULL REFERENCES vehiculo(id_vehiculo),
    motor_anterior VARCHAR(50) NOT NULL,
    motor_nuevo VARCHAR(50) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
