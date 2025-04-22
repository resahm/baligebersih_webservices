const express = require('express');
const userPostLikesController = require('../../controllers/user/like/userPostLikesController');
const { UserPostLikeHistory } = require('../../models'); // ✅ Pastikan model sudah diimpor dengan benar
const authMiddleware = require('../../middleware/authMiddleware'); 

const router = express.Router();

// 🔹 Like postingan
router.post('/:post_id/like', authMiddleware, userPostLikesController.likePost);

// 🔹 Unlike postingan
router.delete('/:post_id/unlike', authMiddleware, userPostLikesController.unlikePost);

// 🔹 Cek status like
router.get('/:post_id/status', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { post_id } = req.params;

    // 🔹 Cek apakah user sudah like post ini
    const like = await UserPostLikeHistory.findOne({ where: { user_id, post_id } });
    
    return res.status(200).json({ isLiked: like !== null });
  } catch (error) {
    console.error("❌ Error checking like status:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔹 Ambil jumlah like suatu post
router.get('/:post_id', async (req, res) => {
  try {
    const { post_id } = req.params;

    // 🔹 Hitung jumlah like berdasarkan post_id
    const likeCount = await UserPostLikeHistory.count({ where: { post_id } });

    return res.status(200).json({ likes: likeCount });
  } catch (error) {
    console.error("❌ Error fetching like count:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
