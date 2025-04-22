const express = require("express");
const router = express.Router();
const announcementController = require("../../controllers/admin/announcement/announcementController");
const authMiddleware = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/adminMiddleware");

// **Hanya Admin yang Bisa CRUD**
router.post("/", authMiddleware, isAdmin, announcementController.createAnnouncement);
router.get("/", authMiddleware, isAdmin, announcementController.getAllAnnouncements);
router.get("/:id", authMiddleware, isAdmin, announcementController.getAnnouncementById);
router.put("/:id", authMiddleware, isAdmin, announcementController.updateAnnouncement);
router.delete("/:id", authMiddleware, isAdmin, announcementController.deleteAnnouncement);

module.exports = router;
