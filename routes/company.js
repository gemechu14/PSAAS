
const express = require("express");
const companyController = require("../controllers/companyController.js");
const upload = require("../middleware/multer");
const middleware=require("../middleware/auth.js");
const router = express.Router();

/**
 * @swagger
 * /api/v1/company:
 *   post:
 *     summary: Create a new company
 *     description: Endpoint to create a new company with the provided details.
 *     tags:
 *       - "Company"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organizationName:
 *                 type: string
 *                 description: The name of the organization
 *                 example: "Abdi plc"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the company
 *                 example: "abdi1@gmail.com"
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the company
 *                 example: "094456781"
 *               streetAddress:
 *                 type: string
 *                 description: The street address of the company
 *                 example: "kality"
 *               companyCode:
 *                 type: string
 *                 description: The unique code for the company
 *                 example: "abdi1"
 *               numberOfEmployees:
 *                 type: integer
 *                 description: The number of employees in the company
 *                 example: 30
 *               jobTitle:
 *                 type: string
 *                 description: The job title (e.g., CEO)
 *                 example: "CEO"
 *               packageId:
 *                 type: integer
 *                 description: The ID of the selected package for the company
 *                 example: 1
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",

  upload.fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "companyBanner", maxCount: 1 },
    { name: "acctImage", maxCount: 1 },
  ]),
  companyController.createCompany
);
/**
 * @swagger
 * /api/v1/company:
 *   get:
 *     summary: Get All Companys
 *     description: Returns a list of Company
 *     tags:
 *       - "Company"
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/", companyController.getAllCompany);
router.get("/profile",
middleware.protectAll,
middleware.restrictToAdmin("companyAdmin"),
companyController.getCompanyProfile);
router.get("/:id", companyController.getCompanyById);


router.post("/", companyController.createCompany);

/**
 * @swagger
 * /api/v1/company:
 *   put:
 *     summary: Update 
 *     description: Endpoint to update the authenticated user's company information.
 *     tags:
 *       - "Company"
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *         tags: Company
 *       - in: body
 *         name: updatedCompany
 *         description: Updated company details
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 organizationName:
 *                   type: string
 *                   description: The updated name of the organization
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The updated email address of the company
 *                 phoneNumber:
 *                   type: string
 *                   description: The updated phone number of the company
 *                 streetAddress:
 *                   type: string
 *                   description: The updated street address of the company
 *                
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Company information updated successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.put(
  "/",
  middleware.protectAll,
  upload.fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "header", maxCount: 1 },
    { name: "footer", maxCount: 1 },
  ]),
  companyController.updateCompany
);


router.post("/update-password/", middleware.protectAll,middleware.validatePasswordUpdate, companyController.updatePassword);


/**
 * @swagger
 * /api/v1/company/get/subscriptionLeftDate:
 *   get:
  *     summary: subscriptionLeftDate
 *     description: Endpoint to update the authenticated user's company information.
 *     tags:
 *       - "Company"
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *         tags: Company
 *               
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Company information updated successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get("/get/subscriptionLeftDate",
middleware.protectAll, 
middleware.restrictTo("companyAdmin"),
companyController.getSubscriptionLeftDate);
/**
 * @swagger
 * /api/v1/company/{companyId}:
 *   delete:
 *     summary: Delete 
 *     description: Endpoint to delete a company by its ID.
 *     tags:
 *       - "Company"
 *     parameters:
 *       - in: path
 *         name: companyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the company to delete
 *     responses:
 *       204:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", companyController.deleteCompany);

/**
 * @swagger
 * /api/v1/company/all/activeCompany:
 *   get:
 *     summary: Active company
 *     description: Returns a list of active Company
 *     tags:
 *       - "Company"
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/all/activeCompany", companyController.getAllActiveCompany);
/**
 * @swagger
 * /api/v1/company/all/blockedCompany:
 *   get:
 *     summary: Blocked company
 *     description: Returns a list of blocked Company
 *     tags:
 *       - "Company"
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/all/blockedCompany", companyController.getAllBlockedCompany);
/**
 * @swagger
 * /api/v1/company/all/deniedCompany:
 *   get:
 *     summary: denied Company
 *     description: Returns a list of blocked Company
 *     tags:
 *       - "Company"
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/all/deniedCompany", companyController.getAllDeniedCompany);
/**
 * @swagger
 * /api/v1/company/all/pendingCompany:
 *   get:
 *     summary: Pending company
 *     description: Returns a list of blocked Company
 *     tags:
 *       - "Company"
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/all/pendingCompany", companyController.getAllPendingCompany);



module.exports = router;
