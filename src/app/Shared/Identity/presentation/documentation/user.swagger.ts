/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios del sistema (CRUD)
 */


/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema con los datos proporcionados
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - us_full_name
 *               - us_email
 *               - us_password_hash
 *               - us_role
 *             properties:
 *               us_full_name:
 *                 type: string
 *                 description: Nombre completo del usuario
 *                 example: "Juan Pérez"
 *               us_email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario (único)
 *                 example: "juan.perez@example.com"
 *               us_password_hash:
 *                 type: string
 *                 description: Contraseña del usuario (mínimo 6 caracteres, debe ser segura)
 *                 example: "SecureP@ss123"
 *               us_role:
 *                 type: string
 *                 enum: [ADMIN, TEACHER]
 *                 description: Rol del usuario dentro del sistema
 *                 example: "TEACHER"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Datos de entrada inválidos o campos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Retorna una lista con todos los usuarios registrados en el sistema
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users found successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */


/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Retorna los datos de un usuario específico mediante su identificador único
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único del usuario (UUID)
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User found successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: ID de usuario no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @swagger
 * /api/user/{id}:
 *   patch:
 *     summary: Actualizar datos de un usuario
 *     description: Actualiza parcialmente los datos de un usuario existente. Se debe enviar al menos un campo a actualizar.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único del usuario (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               us_full_name:
 *                 type: string
 *                 description: Nuevo nombre completo del usuario
 *                 example: "Juan Carlos Pérez"
 *               us_email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo correo electrónico del usuario
 *                 example: "juan.carlos@example.com"
 *               us_role:
 *                 type: string
 *                 enum: [ADMIN, TEACHER]
 *                 description: Nuevo rol del usuario
 *                 example: "ADMIN"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *       400:
 *         description: Datos inválidos o ningún campo enviado para actualizar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @swagger
 * /api/user/{id}/state:
 *   patch:
 *     summary: Cambiar el estado activo de un usuario
 *     description: Alterna el estado activo/inactivo de un usuario (soft delete/restore)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único del usuario (UUID)
 *     responses:
 *       200:
 *         description: Estado del usuario cambiado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "State changed successfully"
 *       400:
 *         description: ID de usuario no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @swagger
 * /api/user/{id}/password:
 *   patch:
 *     summary: Cambiar la contraseña de un usuario
 *     description: Actualiza la contraseña de un usuario existente. La nueva contraseña debe tener al menos 6 caracteres.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único del usuario (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Nueva contraseña del usuario (mínimo 6 caracteres)
 *                 example: "NewSecureP@ss456"
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Contraseña no proporcionada o no cumple con el largo mínimo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje descriptivo del error
 *           example: "Bad Request"
 */


export { };
