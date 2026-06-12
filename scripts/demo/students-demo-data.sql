-- Insertar 12 estudiantes de ejemplo en la tabla "Students" con las nacionalidades estandarizadas
INSERT INTO "Students" (
    st_id,
    st_identification_card,
    st_full_name,
    st_phone_number,
    st_email,
    st_date_of_birth,
    st_nationality,
    st_certificate_type,
    st_start_date,
    st_is_graduated,
    st_contract_status,
    st_progress_category,
    st_created_at,
    st_updated_at
) VALUES 
-- Estudiante 1 (Ecuatoriano: +593)
(gen_random_uuid(), '0101234567', 'Andrea Torres', '+593991234561', 'andrea.torres@example.com', '2001-03-15', 'Ecuatoriano', 'TOEFL', '2025-09-01', false, 'ACTIVE', 'FAST', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Estudiante 2 (Colombiano: +57)
(gen_random_uuid(), '0102345678', 'Carlos Mendoza', '+573001234562', 'carlos.mendoza@example.com', '1999-11-20', 'Colombiano', 'ONE_TONNE', '2025-10-15', false, 'ACTIVE', 'MODERATE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Estudiante 3 (Ecuatoriano: +593)
(gen_random_uuid(), '0103456789', 'Sofia Rojas', '+593971234563', 'sofia.rojas@example.com', '2002-05-10', 'Ecuatoriano', 'OTHER', '2024-01-10', true, 'INACTIVE', 'SLOW', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Estudiante 4 (Peruano: +51)
(gen_random_uuid(), '0104567890', 'Diego Silva', '+51987654324', 'diego.silva@example.com', '2000-08-05', 'Peruano', 'TOEFL', '2026-02-01', false, 'FROZEN', 'NOT_ENOUGH_DATA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Estudiante 5 (Ecuatoriano: +593)
(gen_random_uuid(), '0105678901', 'Valentina Castro', '+593951234565', 'valentina.castro@example.com', '2003-01-25', 'Ecuatoriano', 'ONE_TONNE', '2025-09-01', false, 'ACTIVE', 'FAST', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Estudiante 6 (Argentino: +54)
(gen_random_uuid(), '0106789012', 'Mateo Ortiz', '+5491123456786', 'mateo.ortiz@example.com', '1998-12-12', 'Argentino', 'TOEFL', '2023-06-15', true, 'INACTIVE', 'MODERATE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Estudiante 7 (Ecuatoriano: +593)
(gen_random_uuid(), '0107892690123', 'Camila Vargas', '+593931234567', 'camila.vargas@example.com', '2001-07-30', 'Ecuatoriano', 'OTHER', '2025-11-01', false, 'ACTIVE', 'SLOW', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Estudiante 8 (Chileno: +56)
(gen_random_uuid(), '0108901234', 'Sebastian Nunez', '+56912345678', 'sebastian.nunez@example.com', '2000-02-18', 'Chileno', 'TOEFL', '2026-03-01', false, 'ACTIVE', 'NOT_ENOUGH_DATA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Estudiante 9 (Ecuatoriano: +593)
(gen_random_uuid(), '0109012345', 'Lucia Paredes', '+593911234569', 'lucia.paredes@example.com', '1999-09-22', 'Ecuatoriano', 'ONE_TONNE', '2024-05-10', false, 'FROZEN', 'MODERATE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Estudiante 10 (Mexicano: +52)
(gen_random_uuid(), '0100123456', 'Javier Lopez', '+525512345670', 'javier.lopez@example.com', '2002-11-05', 'Mexicano', 'TOEFL', '2025-08-20', false, 'ACTIVE', 'FAST', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Estudiante 11 (Ecuatoriano: +593)
(gen_random_uuid(), '0111234567', 'Isabella Cruz', '+593992345671', 'isabella.cruz@example.com', '2001-04-14', 'Ecuatoriano', 'OTHER', '2023-02-15', true, 'INACTIVE', 'FAST', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Estudiante 12 (Español: +34)
(gen_random_uuid(), '0112345678', 'Gabriel Ramos', '+34612345672', 'gabriel.ramos@example.com', '2000-10-08', 'Español', 'ONE_TONNE', '2026-01-15', false, 'ACTIVE', 'SLOW', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);




