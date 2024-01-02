const express = require("express");
const router = express.Router();
const middleware=require('../middleware/auth.js')
const departmentController = require("../controllers/department.js");

// Define routes for handling User requests
/**
 * @swagger
* /api/v1/departments:
*   get:
*     summary: GET
*     description: Retrieve a list of all departments.
*     tags:
*       - department
*     parameters:
*       - in: header
*         name: Authorization
*         description: Bearer token for authentication
*         required: true
*         schema:
*           type: string
*           example: "Bearer <your_access_token>"
*     responses:
*       '200':
*         description: Successful response
*         content:
*           application/json:
*             schema:
*       '401':
*         description: Unauthorized
*/
router.get(
  "/",
  middleware.protectAll,
  middleware.restrictALL({ moduleName: "generalsetup", isAccessible: true }),
  departmentController.getAllDepartment
);

/**
 * @swagger
 * tags:
 *   - name: department
 *     description: Department-related operations
 * /api/v1/departments:
 *   post:
 *     summary: Create
 *     description: Create a new department with the provided details.
 *     tags:
 *       - department
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *      #     example: "Bearer <your_access_token>"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deptName:
 *                 type: string
 *                 example: IT
 *               location:
 *                 type: string
 *                 example: Boledd
 *               shorthandRepresentation:
 *                 type: string
 *                 example: IT
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad Request
 */

router.post(
  "/",
  middleware.protectAll,
  middleware.restrictALL({ moduleName: "generalsetup", isAccessible: true }),
  departmentController.createDepartment
);

/**
 * @swagger
* /api/v1/departments/{departmentID}:
*   delete:
*     summary: Delete a department
*     description: Delete a department using its departmentID.
*     tags:
*       - department
*     parameters:
*       - in: path
*         name: departmentID
*         description: ID of the department to be deleted
*         required: true
*         schema:
*           type: integer
*     responses:
*       '204':
*         description: No Content
*       '404':
*         description: Department not found
*       '401':
*         description: Unauthorized
*/
router.delete(
  "/:id",
  middleware.protectAll,
  middleware.restrictALL({ moduleName: "generalsetup", isAccessible: true }),
  departmentController.deleteDepartment
);


/**
 * @swagger
* /api/v1/departments/{departmentID}:
*   put:
*     summary: Delete a department
*     description: Delete a department using its departmentID.
*     tags:
*       - department
*     parameters:
*       - in: path
*         name: departmentID
*         description: ID of the department to be deleted
*         required: true
*         schema:
*           type: integer
*     responses:
*       '204':
*         description: No Content
*       '404':
*         description: Department not found
*       '401':
*         description: Unauthorized
*/
router.put(
  "/:id",
  middleware.protectAll,
  middleware.restrictALL({ moduleName: "generalsetup", isAccessible: true }),
  departmentController.updateDepartment
);

/**
 * @swagger
* /api/v1/departments/{departmentID}:
*   get:
*     summary: Get by ID

*     tags:
*       - department
*     parameters:
*       - in: path
*         name: departmentID
*         description: ID of the department to be retrieved
*         required: true
*         schema:
*           type: integer
*     responses:
*       '200':
*         description: Successful response
*
*       '404':
*         description: Department not found
*       '401':
*         description: Unauthorized
*/
router.get(
  "/:id",
  middleware.protectAll,
  middleware.restrictALL({ moduleName: "generalsetup", isAccessible: true }),
  departmentController.getDepartmentById
);

module.exports = router;
