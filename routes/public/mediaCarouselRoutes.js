const express = require("express");
const { getAllMediaCarousels } = require("../../controllers/admin/mediaCarousel/mediaCarouselController");

const router = express.Router();

// 🔹 Route Public untuk mendapatkan carousel
router.get("/", getAllMediaCarousels);

module.exports = router;
