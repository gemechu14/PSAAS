const express = require("express");
const userController = require("../controllers/userController.js");

const router = express.Router();

router.get("/", userController.getAllUser);
router.get("/:id", userController.getUserById);
/**
 * @swagger
 * /user:
 *   post:
 *     summary: Register a new user
 *     description: Endpoint to register a new user with the provided information.
 *     tags:
 *       - "User Operations"
 *     requestBody:
 *       description: User registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The full name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user.
 *               AccountNumber:
 *                 type: string
 *                 description: The account number of the user.
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - phoneNumber
 *               - AccountNumber
 *     responses:
 *       '201':
 *         description: User successfully registered.
 *       '400':
 *         description: Bad Request - Invalid input or missing required fields.
 *       '500':
 *         description: Internal Server Error - Registration failed for some reason.
 */



router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.put("/CompanyStatus/update", userController.updateCompanyStatus);
router.delete("/:id", userController.deleteUser);
router.put("/taxrules/:taxRuleId");

module.exports = router;
