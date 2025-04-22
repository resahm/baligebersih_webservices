const express = require("express");
const { getAllAnnouncements } = require("../../controllers/admin/announcement/announcementController");
const { getAnnouncementById } = require("../../controllers/admin/announcement/announcementController");

const router = express.Router();

// 🔹 Route Public untuk mendapatkan carousel
router.get("/", getAllAnnouncements);
router.get("/:id", getAnnouncementById);


module.exports = router;
