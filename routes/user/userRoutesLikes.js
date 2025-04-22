const express = require('express');
const userReportLikesController = require('../../controllers/user/like/userReportLikesController');
const { UserReportLikeHistory } = require('../../models'); // ✅ Import model yang benar
const authMiddleware = require('../../middleware/authMiddleware'); 

const router = express.Router();

// 🔹 Like laporan
router.post('/:report_id/like', authMiddleware, userReportLikesController.likeReport);

// 🔹 Unlike laporan
router.delete('/:report_id/unlike', authMiddleware, userReportLikesController.unlikeReport);

// 🔹 Cek status like
router.get('/:report_id/status', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { report_id } = req.params;

    const like = await UserReportLikeHistory.findOne({ where: { user_id, report_id } });
    return res.status(200).json({ isLiked: like !== null });
  } catch (error) {
    console.error("❌ Error checking like status:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
