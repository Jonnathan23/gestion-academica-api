-- 1. Habilitar la extensión criptográfica para gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Asegurar la existencia de la tabla antes de la inyección (Alineado con User.model.ts)
CREATE TABLE IF NOT EXISTS "Users" (
    "us_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "us_full_name" VARCHAR(255) UNIQUE NOT NULL,
    "us_email" VARCHAR(255) UNIQUE NOT NULL,
    "us_password_hash" VARCHAR(255) NOT NULL,
    "us_role" VARCHAR(50) NOT NULL CHECK ("us_role" IN ('ADMIN', 'TEACHER', 'ADVISOR', 'ACADEMIC_DIRECTOR')),
    "us_is_active" BOOLEAN NOT NULL DEFAULT true,
    "us_created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "us_updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inyección del usuario Administrador actualizado
INSERT INTO "Users" (
    "us_id", 
    "us_full_name", 
    "us_email", 
    "us_password_hash", 
    "us_role", 
    "us_is_active", 
    "us_created_at", 
    "us_updated_at"
) VALUES (
    gen_random_uuid(), -- Genera un UUID v4 nativo en PostgreSQL
    'Admin', 
    'admin@salc.edu', 
    '$2b$10$j9eDeK2ddnKcsvP6kfm.kuulyjG4X2Dn64QQ3x.L1pXolH25ZlrLu', -- Hash BCrypt para 'Administrador_salc'
    'ADMIN', 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
)
ON CONFLICT ("us_email") DO NOTHING;