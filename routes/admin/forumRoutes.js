const express = require("express");
const router = express.Router();
const forumController = require("../../controllers/admin/forum/forumController");
const authMiddleware = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/adminMiddleware"); // Middleware cek admin

// ✅ Middleware Admin Only
const adminOnly = [authMiddleware, isAdmin];

// ✅ Forum Admin Routes
router.get("/", adminOnly, forumController.getAllPostsAdmin);
router.post("/", adminOnly, forumController.createPostAdmin);
router.put("/:id", adminOnly, forumController.updatePostAdmin);
router.post("/comment", adminOnly, forumController.createCommentAdmin);
router.delete("/:id", adminOnly, forumController.deletePostAdmin);
router.put("/comment/:id", adminOnly, forumController.updateCommentAdmin);
router.delete("/comment/:id", adminOnly, forumController.deleteCommentAdmin);
router.put("/pin/:id", adminOnly, forumController.togglePinPost); // Pin/unpin post

module.exports = router;
