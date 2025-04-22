const express = require("express");
const router = express.Router();
const userManagementController = require("../../controllers/admin/user/userManagementController");
const authMiddleware = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/adminMiddleware");

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin - User Management]
 *     responses:
 *       200:
 *         description: Successfully fetched all users
 */
router.get("/", authMiddleware, isAdmin, userManagementController.getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin - User Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 */
router.get("/:id", authMiddleware, isAdmin, userManagementController.getUserById);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Admin - User Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User updated
 */
router.put("/:id", authMiddleware, isAdmin, userManagementController.updateUser);

/**
 * @swagger
 * /api/admin/users/details/{id}:
 *   get:
 *     summary: Get detailed user information
 *     tags: [Admin - User Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Detailed user information
 */
router.get("/details/:id", authMiddleware, isAdmin, userManagementController.getUserDetails);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Admin - User Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/:id", authMiddleware, isAdmin, userManagementController.deleteUser);

/**
 * @swagger
 * /api/admin/users/block/{id}:
 *   put:
 *     summary: Block user by ID
 *     tags: [Admin - User Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User blocked
 */
router.put("/block/:id", authMiddleware, isAdmin, userManagementController.blockUser);

/**
 * @swagger
 * /api/admin/users/unblock/{id}:
 *   put:
 *     summary: Unblock user by ID
 *     tags: [Admin - User Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User unblocked
 */
router.put("/unblock/:id", authMiddleware, isAdmin, userManagementController.unblockUser);

/**
 * @swagger
 * /api/admin/users/change-password/{id}:
 *   put:
 *     summary: Change user password by ID
 *     tags: [Admin - User Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User password changed
 */
router.put("/change-password/:id", authMiddleware, isAdmin, userManagementController.changeUserPassword);

module.exports = router;
