const { Post, PostImage, Comment, User } = require("../../../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Konfigurasi Multer untuk Upload Gambar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/forum/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage }).array("images", 5); // Maksimal 5 gambar


exports.getAllPostsAdmin = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                { model: User, as: "user", attributes: ["id", "username", "profile_picture"] },
                { model: PostImage, as: "images" },
                {
                    model: Comment,
                    as: "comments",
                    include: { model: User, as: "user", attributes: ["id", "username", "profile_picture"] }
                }
            ],
            order: [
                ["is_pinned", "DESC"],
                ["createdAt", "DESC"]
            ]
        });

        res.status(200).json({ message: "Posts retrieved successfully", posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.createPostAdmin = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload error", error: err.message });
      }
  
      try {
        const { content } = req.body;
        const user_id = req.user.id;
  
        if (!content) {
          return res.status(400).json({ message: "Content is required" });
        }
  
        // 🔒 Validasi maksimal 5 gambar
        if (req.files && req.files.length > 5) {
          // Hapus file yg sudah terlanjur diupload
          req.files.forEach((file) => {
            const fs = require("fs");
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
          return res.status(400).json({ message: "Maksimal hanya boleh mengunggah 5 gambar" });
        }
  
        const newPost = await Post.create({ user_id, content });
  
        let images = [];
        if (req.files && req.files.length > 0) {
          images = req.files.map((file) => ({
            post_id: newPost.id,
            image: `uploads/forum/${file.filename}`,
          }));
          await PostImage.bulkCreate(images);
        }
  
        const fullPost = await Post.findByPk(newPost.id, {
          include: [
            { model: User, as: "user", attributes: ["id", "username"] },
            { model: PostImage, as: "images" },
            { model: Comment, as: "comments" },
          ],
        });
  
        res.status(201).json({ message: "Post created successfully", post: fullPost });
      } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    });
  };

  exports.updatePostAdmin = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload error", error: err.message });
    }

    try {
      const { id } = req.params;
      const { content } = req.body;
      const user_id = req.user.id;

      const post = await Post.findByPk(id, {
        include: { model: PostImage, as: "images" }
      });

      if (!post) {
        return res.status(404).json({ message: "Post tidak ditemukan" });
      }

      // Update konten
      post.content = content || post.content;
      post.user_id = user_id;
      await post.save();

      // Jika ada gambar baru, hapus gambar lama dulu
      if (req.files && req.files.length > 0) {
        // Hapus gambar lama dari filesystem
        for (const image of post.images) {
          if (fs.existsSync(image.image)) {
            fs.unlinkSync(image.image);
          }
        }

        // Hapus gambar lama dari database
        await PostImage.destroy({ where: { post_id: post.id } });

        // Simpan gambar baru
        const newImages = req.files.map((file) => ({
          post_id: post.id,
          image: `uploads/forum/${file.filename}`
        }));
        await PostImage.bulkCreate(newImages);
      }

      // Ambil data lengkap yang sudah diperbarui
      const updatedPost = await Post.findByPk(post.id, {
        include: [
          { model: User, as: "user", attributes: ["id", "username"] },
          { model: PostImage, as: "images" },
          { model: Comment, as: "comments" },
        ],
      });

      res.status(200).json({ message: "Post berhasil diperbarui", post: updatedPost });
    } catch (error) {
      console.error("❌ Error updatePostAdmin:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};
  

// ✅ DELETE POST (Admin)
exports.deletePostAdmin = async (req, res) => {
    try {
      const { id } = req.params;
  
      const post = await Post.findByPk(id, { include: { model: PostImage, as: "images" } });
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Hapus gambar terkait post
      for (const image of post.images) {
        if (fs.existsSync(image.image)) {
          fs.unlinkSync(image.image); // Menghapus file gambar
        }
      }
  
      // Hapus post dan komentar terkait
      await PostImage.destroy({ where: { post_id: id } });
      await Comment.destroy({ where: { post_id: id } });
      await post.destroy();
  
      res.status(200).json({ message: "Post and related comments deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


exports.createCommentAdmin = async (req, res) => {
    try {
        const { post_id, content } = req.body;
        const user_id = req.user.id;

        if (!post_id || !content) {
            return res.status(400).json({ message: "Post ID and content are required" });
        }

        const newComment = await Comment.create({ post_id, user_id, content });

        const fullComment = await Comment.findByPk(newComment.id, {
            include: { model: User, as: "user", attributes: ["id", "username"] }
        });

        res.status(201).json({ message: "Comment added successfully", comment: fullComment });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateCommentAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user_id = req.user.id;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: "Komentar tidak ditemukan" });
    }

    // Opsional: validasi bahwa hanya pemilik komentar atau admin yang boleh mengedit
    if (comment.user_id !== user_id) {
      return res.status(403).json({ message: "Anda tidak memiliki izin untuk mengedit komentar ini" });
    }

    comment.content = content || comment.content;
    await comment.save();

    const updatedComment = await Comment.findByPk(id, {
      include: { model: User, as: "user", attributes: ["id", "username", "profile_picture"] }
    });

    res.status(200).json({
      message: "Komentar berhasil diperbarui",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.deleteCommentAdmin = async (req, res) => {
    try {
      const { id } = req.params;
  
      const comment = await Comment.findByPk(id);
  
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      await comment.destroy();
  
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


exports.togglePinPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.is_pinned = !post.is_pinned;
        await post.save();

        res.status(200).json({ message: `Post ${post.is_pinned ? "pinned" : "unpinned"} successfully`, post });
    } catch (error) {
        console.error("Error pinning post:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

