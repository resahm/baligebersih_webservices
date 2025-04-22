const express = require("express");
const router = express.Router();
const mediaCarouselController = require("../../controllers/admin/mediaCarousel/mediaCarouselController");
const authMiddleware = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/adminMiddleware");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const extendTokenIfNeeded = require('../../middleware/extendTokenIfNeeded');

router.use(extendTokenIfNeeded);

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/carousel/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post("/", authMiddleware, isAdmin, upload.single("image"), mediaCarouselController.createMediaCarousel);
router.get("/", mediaCarouselController.getAllMediaCarousels);
router.get("/:id", authMiddleware, isAdmin, mediaCarouselController.getMediaCarouselById);
router.put("/:id", authMiddleware, isAdmin, upload.single("image"), mediaCarouselController.updateMediaCarousel);
router.delete("/:id", authMiddleware, isAdmin, mediaCarouselController.deleteMediaCarousel);

module.exports = router;
