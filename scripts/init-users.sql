-- 1. Habilitar la extensión criptográfica (Recomendado para gen_random_uuid en algunas versiones)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Asegurar la existencia de la tabla antes de la inyección
-- Esto previene fallos si el backend de Bun/Sequelize tarda unos milisegundos más en arrancar
CREATE TABLE IF NOT EXISTS "Users" (
    us_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    us_full_name VARCHAR(255) NOT NULL,
    us_email VARCHAR(255) UNIQUE NOT NULL,
    us_password_hash VARCHAR(255) NOT NULL,
    us_role VARCHAR(50) NOT NULL CHECK (us_role IN ('ADMIN', 'TEACHER', 'ADVISOR', 'ACADEMIC_DIRECTOR')),
    us_is_active BOOLEAN DEFAULT true,
    us_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    us_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Inyección del usuario Administrador
-- Utilizamos ON CONFLICT para que no dé error si el contenedor se reinicia y el usuario ya existe
INSERT INTO "Users" (
    us_id, 
    us_full_name, 
    us_email, 
    us_password_hash, 
    us_role, 
    us_is_active, 
    us_created_at, 
    us_updated_at
) 
VALUES (
    gen_random_uuid(), 
    'Diego', 
    'admin@salc.edu', 
    '$2b$10$0zwKm3Up0kieVXBf/7qQUeC476IQSRC1t0sCbxDLUSXQkzBfOd4UG', 
    'ADMIN', 
    true,              
    NOW(),             
    NOW()              
)
ON CONFLICT (us_email) DO NOTHING;