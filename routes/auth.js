const express = require("express");
const authcontroller = require("../controllers/authController");
const middleware = require("../middleware/auth");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // Adjust this condition based on your authentication mechanism
    return next(); // User is logged in, proceed to logout
  } else {
    res.status(401).json({ message: "User is not logged in" }); // User is not logged in
  }
}

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: authorization

 * /login/companyLogin:
 *   post:
 *     summary: Company
 *     description: Login to the system and obtain an access token.
 *     tags:
 *       - authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: abdi3@gmail.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: abdi3000
 *               companyCode:
 *                 type: string
 *                 description: Code associated with the company
 *                 example: abdi3
 *     responses:
 *       '200':
 *         description: Successful login

 */

router.post("/login/companyLogin", authcontroller.login);

/**
 * @swagger
 * tags:
 *   - name: authorization

 * /login/superAdmin:
 *   post:
 *     summary:  Super Admin
 *     description: Login to the system and obtain an access token.
 *     tags:
 *       - authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: abdi3@gmail.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: abdi3000
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                   example: <your_access_token>
 */

router.post("/login/superAdmin", authcontroller.superAdminLogin);


/**
 * @swagger
 * tags:
 *   - name: authorization

 * /refreshToken:
 *   post:
 *     summary:  refreshToken
 *     description: Login to the system and obtain an access token.
 *     tags:
 *       - authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *               
 *                 description: User's email address
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVyQWRtaW4iLCJpYXQiOjE3MDQxMDg2MTEsImV4cCI6MTcwNDcxMzQxMX0.zhkJ3UNAOwI5UCmzsPLOz2mX2KTjVa1xu_a-I9qc6l4

 *     responses:
 *       '200':
 *         description: refresh token 
 */
router.post("/refreshToken", authcontroller.refreshToken);


/**
 * @swagger
 * tags:
 *   - name: authorization
 *     description: User-related operations
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the user profile using the provided access token.
 *     tags:
 *       - authorization
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
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   description: User ID
 *                 username:
 *                   type: string
 *                   description: User's username
 *               # Add other user details as needed
 */
router.get("/user/profile", 
middleware.protectAll,
middleware.restrictToAll('companyAdmin','superAdmin','employee'),
authcontroller.getProfile);


router.get("/logout", authcontroller.logout)

module.exports = router;
