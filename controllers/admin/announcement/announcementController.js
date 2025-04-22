const { Announcement, Notification, User } = require("../../../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Konfigurasi Multer untuk Upload File
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/announcements/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage }).single("file");

// ✅ CREATE ANNOUNCEMENT (Admin Only)
exports.createAnnouncement = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload error", error: err.message });
      }
  
      try {
        const { title, description } = req.body;
        const user_id = req.user.id; // 🔥 ambil user_id dari token
  
        if (!title || !description) {
          return res.status(400).json({ message: "Title and description are required" });
        }
  
        const newAnnouncement = await Announcement.create({
          title,
          description,
          file: req.file ? `uploads/announcements/${req.file.filename}` : null,
          user_id, // 🔥 simpan user_id
        });
  
        // Kirim notifikasi ke semua user
        const users = await User.findAll({ where: { type: 0 } });
        await Promise.all(
          users.map(user =>
            Notification.create({
              user_id: user.id,
              title: "Pengumuman Baru",
              message: `Terdapat pengumuman baru: ${title}`,
              type: "general",
              sent_by: "system",
              role_target: "user",
              is_read: false,
            })
          )
        );
  
        res.status(201).json({
          message: "Announcement created successfully",
          announcement: newAnnouncement
        });
      } catch (error) {
        console.error("Error creating announcement:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    });
  };
  
  

// ✅ GET ALL ANNOUNCEMENTS
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.findAll({ order: [["createdAt", "DESC"]] });
        res.status(200).json({ message: "Announcements retrieved successfully", announcements });
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ GET ANNOUNCEMENT BY ID
exports.getAnnouncementById = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findByPk(id);

        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json({ message: "Announcement retrieved successfully", announcement });
    } catch (error) {
        console.error("Error fetching announcement:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ UPDATE ANNOUNCEMENT (Admin Only)
exports.updateAnnouncement = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload error", error: err.message });
      }
  
      try {
        const { id } = req.params;
        const { title, description } = req.body;
        const user_id = req.user.id; // 🔥 ambil user_id dari token
  
        const announcement = await Announcement.findByPk(id);
  
        if (!announcement) {
          return res.status(404).json({ message: "Announcement not found" });
        }
  
        if (announcement.user_id !== user_id) {
          return res.status(403).json({ message: "You do not have permission to update this announcement" });
        }
  
        if (req.file) {
          if (announcement.file && fs.existsSync(announcement.file)) {
            fs.unlinkSync(announcement.file);
          }
          announcement.file = `uploads/announcements/${req.file.filename}`;
        }
  
        announcement.title = title || announcement.title;
        announcement.description = description || announcement.description;
        await announcement.save();
  
        res.status(200).json({ message: "Announcement updated successfully", announcement });
      } catch (error) {
        console.error("Error updating announcement:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    });
  };
  

// ✅ DELETE ANNOUNCEMENT (Admin Only)
exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findByPk(id);

        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        // Hapus file dari server
        if (announcement.file && fs.existsSync(announcement.file)) {
            fs.unlinkSync(announcement.file);
        }

        await announcement.destroy();
        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
