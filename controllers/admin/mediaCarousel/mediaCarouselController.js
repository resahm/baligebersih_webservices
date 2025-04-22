const { MediaCarousel } = require("../../../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Konfigurasi Multer untuk Upload Gambar
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
const upload = multer({ storage }).single("image");

// ✅ CREATE MEDIA CAROUSEL (Admin Only)
exports.createMediaCarousel = async (req, res) => {
  try {
    const { title, description } = req.body;
    const user_id = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Judul wajib diisi." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Gambar wajib diunggah." });
    }

    const newMediaCarousel = await MediaCarousel.create({
      title,
      description: description || "",
      image: `uploads/carousel/${req.file.filename}`,
      user_id,
    });

    res.status(201).json({
      message: "Media carousel berhasil dibuat.",
      mediacarousel: newMediaCarousel,
    });
  } catch (error) {
    console.error("❌ Error createMediaCarousel:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};


  
  // ✅ GET ALL MEDIA CAROUSELS
  exports.getAllMediaCarousels = async (req, res) => {
    try {
      const mediacarousels = await MediaCarousel.findAll({
        order: [["createdAt", "DESC"]],
      });
  
      res.status(200).json({
        message: "Berhasil mengambil daftar media carousel.",
        mediacarousels,
      });
    } catch (error) {
      console.error("❌ Error getAllMediaCarousels:", error);
      res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
  };
  
  // ✅ GET MEDIA CAROUSEL BY ID
  exports.getMediaCarouselById = async (req, res) => {
    try {
      const { id } = req.params;
      const mediacarousel = await MediaCarousel.findByPk(id);
  
      if (!mediacarousel) {
        return res.status(404).json({ message: "Media carousel tidak ditemukan." });
      }
  
      res.status(200).json({
        message: "Berhasil mengambil media carousel.",
        mediacarousel,
      });
    } catch (error) {
      console.error("❌ Error getMediaCarouselById:", error);
      res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
  };
  
  // ✅ UPDATE MEDIA CAROUSEL
  exports.updateMediaCarousel = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
  
      const mediacarousel = await MediaCarousel.findByPk(id);
      if (!mediacarousel) {
        return res.status(404).json({ message: "Media carousel tidak ditemukan." });
      }
  
      if (req.file) {
        if (fs.existsSync(mediacarousel.image)) {
          fs.unlinkSync(mediacarousel.image);
        }
        mediacarousel.image = `uploads/carousel/${req.file.filename}`;
      }
  
      mediacarousel.title = title || mediacarousel.title;
      mediacarousel.description = description || mediacarousel.description;
  
      await mediacarousel.save();
  
      res.status(200).json({
        message: "Media carousel berhasil diperbarui.",
        mediacarousel,
      });
    } catch (error) {
      console.error("❌ Error updateMediaCarousel:", error);
      res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
  };
  
  // ✅ DELETE MEDIA CAROUSEL
  exports.deleteMediaCarousel = async (req, res) => {
    try {
      const { id } = req.params;
      const mediacarousel = await MediaCarousel.findByPk(id);
  
      if (!mediacarousel) {
        return res.status(404).json({ message: "Media carousel tidak ditemukan." });
      }
  
      if (fs.existsSync(mediacarousel.image)) {
        fs.unlinkSync(mediacarousel.image);
      }
  
      await mediacarousel.destroy();
  
      res.status(200).json({ message: "Media carousel berhasil dihapus." });
    } catch (error) {
      console.error("❌ Error deleteMediaCarousel:", error);
      res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
  };