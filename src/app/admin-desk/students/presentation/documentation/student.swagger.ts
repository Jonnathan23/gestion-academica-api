/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management (registration, search, updates, and status changes)
 */

/**
 * @swagger
 * /api/students/register:
 *   post:
 *     summary: Register a new student
 *     description: Creates a new student record in the system. Requires administrator privileges (bearerAuth + ADMIN role).
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identificationCard
 *               - fullName
 *               - phoneNumber
 *               - startDate
 *             properties:
 *               identificationCard:
 *                 type: string
 *                 pattern: '^\d{10}$'
 *                 description: Student identification card number (exactly 10 numeric digits)
 *                 example: "0102030405"
 *               fullName:
 *                 type: string
 *                 minLength: 3
 *                 description: Full name of the student (minimum 3 characters)
 *                 example: "María García López"
 *               phoneNumber:
 *                 type: string
 *                 pattern: '^\d{10}$'
 *                 description: Contact phone number (exactly 10 numeric digits)
 *                 example: "0991234567"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Contract or enrollment start date (ISO 8601 format)
 *                 example: "2026-03-01"
 *     responses:
 *       201:
 *         description: Student registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Student registered successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Missing required fields, invalid identification card, or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/students/search:
 *   get:
 *     summary: Search students
 *     description: Searches for students by identification card (CI) or name. Returns all students if no query is provided. Requires administrator privileges (bearerAuth + ADMIN role).
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query — matches against identification card or student name (optional, returns all if empty)
 *         example: "María"
 *     responses:
 *       200:
 *         description: Students found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Students found successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/students/{id}:
 *   patch:
 *     summary: Update student data
 *     description: Partially updates the data of an existing student. At least one field must be provided. Requires administrator privileges (bearerAuth + ADMIN role).
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique student identifier (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identificationCard:
 *                 type: string
 *                 pattern: '^\d{10}$'
 *                 description: New identification card number (exactly 10 numeric digits)
 *                 example: "0102030405"
 *               fullName:
 *                 type: string
 *                 description: New full name
 *                 example: "María García Rodríguez"
 *               phoneNumber:
 *                 type: string
 *                 pattern: '^\d{10}$'
 *                 description: New phone number (exactly 10 numeric digits)
 *                 example: "0997654321"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: New start date (ISO 8601 format)
 *                 example: "2026-04-15"
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Student updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: No data provided, invalid fields, or invalid UUID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/students/{id}/contract-status:
 *   patch:
 *     summary: Change student contract status
 *     description: Updates the contract status of a student (ACTIVE, FROZEN, or INACTIVE). Requires administrator privileges (bearerAuth + ADMIN role).
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique student identifier (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contractStatus
 *             properties:
 *               contractStatus:
 *                 type: string
 *                 enum: [ACTIVE, FROZEN, INACTIVE]
 *                 description: New contract status for the student
 *                 example: "FROZEN"
 *     responses:
 *       200:
 *         description: Contract status changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Student contract status changed successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Missing or invalid contract status, or invalid UUID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/students/{id}/graduated:
 *   patch:
 *     summary: Toggle student graduated status
 *     description: Inverts the graduated status of a student (graduated ↔ not graduated). No request body needed. Requires administrator privileges (bearerAuth + ADMIN role).
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique student identifier (UUID)
 *     responses:
 *       200:
 *         description: Graduated status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Student graduated status toggled successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid UUID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/students/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a student
 *     description: Sets the student contract status to INACTIVE. No request body needed. Requires administrator privileges (bearerAuth + ADMIN role).
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique student identifier (UUID)
 *     responses:
 *       200:
 *         description: Student deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Student deactivated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid UUID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export {};
