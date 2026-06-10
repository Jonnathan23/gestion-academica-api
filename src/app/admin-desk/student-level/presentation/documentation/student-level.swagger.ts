/**
 * @swagger
 * tags:
 *   name: StudentLevels
 *   description: Management of student progression through academic modules (Purchases, Status Updates, Deletions)
 */

/**
 * @swagger
 * /api/student-levels/student/{studentId}:
 *   post:
 *     summary: Purchase modules for a student
 *     description: Registers one or more academic modules for a specific student. Requires authentication (bearerAuth).
 *     tags: [StudentLevels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleIds
 *             properties:
 *               moduleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: List of module IDs to be purchased
 *                 example: ["uuid-1", "uuid-2"]
 *     responses:
 *       201:
 *         description: Modules purchased successfully. Returns the list of student levels created/updated.
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
 *                   example: "Modules purchased successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StudentLevel'
 *       400:
 *         description: Bad Request (e.g., empty moduleIds, invalid UUID format, or non-existent modules)
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
 * /api/student-levels/student/{studentId}:
 *   get:
 *     summary: Get all academic levels for a student
 *     description: Returns a list of all StudentLevel records for a specific student. Requires authentication (bearerAuth).
 *     tags: [StudentLevels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the student
 *     responses:
 *       200:
 *         description: List of student levels retrieved successfully, including module details.
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
 *                   example: "Contracts retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StudentLevel'
 *       400:
 *         description: Invalid studentId format (must be a valid UUID)
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
 * /api/student-levels/{studentLevelId}/status:
 *   patch:
 *     summary: Update student level status
 *     description: Updates the status of a specific student level. Valid statuses are ACTIVE, APPROVED, or LOCKED. Requires authentication (bearerAuth).
 *     tags: [StudentLevels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentLevelId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the student level record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - studentId
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, APPROVED, LOCKED]
 *                 description: New status for the level
 *                 example: "APPROVED"
 *               studentId:
 *                 type: string
 *                 format: uuid
 *                 description: Unique identifier of the student associated with this level
 *                 example: "uuid-student-123"
 *     responses:
 *       200:
 *         description: Student level status updated successfully.
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
 *                   example: "Student level updated successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StudentLevel'
 *       400:
 *         description: Invalid status, missing fields, or bad request formatting.
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
 *         description: Student level record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/student-levels/{studentLevelId}:
 *   delete:
 *     summary: Delete a student level
 *     description: Permanently removes a student level record from the system. Requires authentication (bearerAuth).
 *     tags: [StudentLevels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentLevelId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the student level record to delete
 *     responses:
 *       200:
 *         description: Student level record deleted successfully.
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
 *                   example: "Student level deleted successfully"
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Student level record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StudentLevel:
 *       type: object
 *       required:
 *         - id
 *         - studentId
 *         - moduleId
 *         - sellerId
 *         - status
 *         - purchaseDate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the student level record
 *         studentId:
 *           type: string
 *           format: uuid
 *           description: Identifier of the student associated with this level
 *         moduleId:
 *           type: string
 *           format: uuid
 *           description: Identifier of the academic module
 *         sellerId:
 *           type: string
 *           format: uuid
 *           description: Identifier of the user who processed the purchase
 *         status:
 *           type: string
 *           enum: [ACTIVE, APPROVED, LOCKED]
 *           description: Current status of the student level
 *         purchaseDate:
 *           type: string
 *           format: date-time
 *           description: Date when the level was purchased
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Record creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Record last update timestamp
 *         module:
 *           $ref: '#/components/schemas/Module'
 *           description: Detailed data of the associated academic module
 */

export {};
