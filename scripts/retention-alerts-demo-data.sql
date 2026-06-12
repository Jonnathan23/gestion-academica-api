-- Insertar datos demo para RetentionAlerts usando los estudiantes previamente creados
-- ID de usuario (teacher): f60b96a6-aed6-42aa-b468-922ddf29a6ed

-- Alerta 1: Andrea Torres (PENDING, 5 días de ausencia)
INSERT INTO "RetentionAlerts" (
    re_al_id, re_al_student_id, re_al_user_id, re_al_contact_date, re_al_has_responded,
    re_al_days_absent, re_al_is_justified, re_al_justification_reason, re_al_return_deadline,
    re_al_observations, re_al_status, re_al_resolution_date, re_al_created_at, re_al_updated_at
)
SELECT 
    gen_random_uuid(), st_id, 'f60b96a6-aed6-42aa-b468-922ddf29a6ed', '2026-06-05', false,
    5, false, null, null,
    'Estudiante no ha asistido a clases por 5 días consecutivos. Se le envió un correo recordatorio.', 'PENDING', null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Students" WHERE st_identification_card = '0101234567';

-- Alerta 2: Carlos Mendoza (IN_PROGRESS, 10 días de ausencia, ya respondió)
INSERT INTO "RetentionAlerts" (
    re_al_id, re_al_student_id, re_al_user_id, re_al_contact_date, re_al_has_responded,
    re_al_days_absent, re_al_is_justified, re_al_justification_reason, re_al_return_deadline,
    re_al_observations, re_al_status, re_al_resolution_date, re_al_created_at, re_al_updated_at
)
SELECT 
    gen_random_uuid(), st_id, 'f60b96a6-aed6-42aa-b468-922ddf29a6ed', '2026-06-01', true,
    10, false, null, '2026-06-15',
    'El estudiante contestó e indicó problemas familiares. Se comprometió a regresar a clases la próxima semana.', 'IN_PROGRESS', null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Students" WHERE st_identification_card = '0102345678';

-- Alerta 3: Sofia Rojas (RESOLVED, 7 días de ausencia, justificada)
INSERT INTO "RetentionAlerts" (
    re_al_id, re_al_student_id, re_al_user_id, re_al_contact_date, re_al_has_responded,
    re_al_days_absent, re_al_is_justified, re_al_justification_reason, re_al_return_deadline,
    re_al_observations, re_al_status, re_al_resolution_date, re_al_created_at, re_al_updated_at
)
SELECT 
    gen_random_uuid(), st_id, 'f60b96a6-aed6-42aa-b468-922ddf29a6ed', '2026-05-20', true,
    7, true, 'Certificado médico presentado por enfermedad.', null,
    'Estudiante presentó certificado médico validado. El caso está resuelto y ya se reincorporó.', 'RESOLVED', '2026-05-25', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Students" WHERE st_identification_card = '0103456789';

-- Alerta 4: Diego Silva (CLOSED_FROZEN, 20 días de ausencia, no responde)
INSERT INTO "RetentionAlerts" (
    re_al_id, re_al_student_id, re_al_user_id, re_al_contact_date, re_al_has_responded,
    re_al_days_absent, re_al_is_justified, re_al_justification_reason, re_al_return_deadline,
    re_al_observations, re_al_status, re_al_resolution_date, re_al_created_at, re_al_updated_at
)
SELECT 
    gen_random_uuid(), st_id, 'f60b96a6-aed6-42aa-b468-922ddf29a6ed', '2026-05-10', false,
    20, false, null, null,
    'No se pudo establecer contacto tras múltiples intentos (llamadas y correos). Se congela el perfil.', 'CLOSED_FROZEN', '2026-05-30', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Students" WHERE st_identification_card = '0104567890';

-- Alerta 5: Valentina Castro (PENDING, 3 días de ausencia)
INSERT INTO "RetentionAlerts" (
    re_al_id, re_al_student_id, re_al_user_id, re_al_contact_date, re_al_has_responded,
    re_al_days_absent, re_al_is_justified, re_al_justification_reason, re_al_return_deadline,
    re_al_observations, re_al_status, re_al_resolution_date, re_al_created_at, re_al_updated_at
)
SELECT 
    gen_random_uuid(), st_id, 'f60b96a6-aed6-42aa-b468-922ddf29a6ed', '2026-06-10', false,
    3, false, null, null,
    'Ausencia temprana detectada. Primera alerta generada para seguimiento.', 'PENDING', null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Students" WHERE st_identification_card = '0105678901';

-- Alerta 6: Mateo Ortiz (IN_PROGRESS, 12 días de ausencia)
INSERT INTO "RetentionAlerts" (
    re_al_id, re_al_student_id, re_al_user_id, re_al_contact_date, re_al_has_responded,
    re_al_days_absent, re_al_is_justified, re_al_justification_reason, re_al_return_deadline,
    re_al_observations, re_al_status, re_al_resolution_date, re_al_created_at, re_al_updated_at
)
SELECT 
    gen_random_uuid(), st_id, 'f60b96a6-aed6-42aa-b468-922ddf29a6ed', '2026-06-02', true,
    12, false, null, '2026-06-20',
    'El estudiante solicitó unos días adicionales por mudanza. Promete regresar el 20 de junio.', 'IN_PROGRESS', null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Students" WHERE st_identification_card = '0106789012';
