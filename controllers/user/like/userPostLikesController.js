const { UserPostLikeHistory, Post } = require('../../../models');

exports.likePost = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { post_id } = req.params;

    // 🔹 Pastikan post_id adalah angka valid
    if (isNaN(post_id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // 🔹 Cek apakah postingan ada
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🔹 Cek apakah user sudah like postingan ini
    const existingLike = await UserPostLikeHistory.findOne({ where: { user_id, post_id } });
    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this post" });
    }

    // 🔹 Tambahkan like ke `t_post_like`
    await UserPostLikeHistory.create({ user_id, post_id });

    // 🔹 Tambahkan like ke `t_post`
    await post.increment('total_likes');

    return res.status(201).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("❌ Error liking post:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.unlikePost = async (req, res) => {
    try {
      const user_id = req.user.id;
      const { post_id } = req.params;
  
      // 🔹 Pastikan post_id adalah angka valid
      if (isNaN(post_id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
  
      // 🔹 Cek apakah user pernah like postingan ini
      const like = await UserPostLikeHistory.findOne({ where: { user_id, post_id } });
      if (!like) {
        return res.status(404).json({ message: "You haven't liked this post" });
      }
  
      // 🔹 Hapus like dari `t_post_like`
      await like.destroy();
  
      // 🔹 Kurangi jumlah like di `t_post`
      const post = await Post.findByPk(post_id);
      if (post) {
        await post.decrement('total_likes');
      }
  
      return res.status(200).json({ message: "Like removed successfully" });
    } catch (error) {
      console.error("❌ Error unliking post:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  