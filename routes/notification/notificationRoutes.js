const express = require("express");
const router = express.Router();
const NotificationController = require("../../controllers/notification/NotificationController");
const authMiddleware = require("../../middleware/authMiddleware");

// ✅ Ambil semua notifikasi (untuk admin)
router.get("/", NotificationController.getAll);

// ✅ Ambil notifikasi milik user tertentu
router.get("/user/:userId", NotificationController.getByUser);

// ✅ Tandai notifikasi sebagai dibaca
router.put("/read/:id", NotificationController.markAsRead);

router.put("/read-all", authMiddleware, NotificationController.markAllAsRead); 

// ✅ Hapus notifikasi
router.delete("/:id", NotificationController.delete);

router.post("/user/fcm-token", NotificationController.registerFcmToken);


  
  

module.exports = router;
