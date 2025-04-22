const { User, Post, Report, UserReportLikeHistory, PostImage, PostLikes, Comment, ReportAttachment } = require("../../../models");
const bcrypt = require("bcryptjs"); // pastikan sudah diimport


// ✅ GET ALL USERS
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "username", "email", "phone_number", "type", "blocked_until","auth_provider","profile_picture","createdAt"],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ GET USER BY ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: ["id", "username", "email", "phone_number", "type", "blocked_until","profile_picture","createdAt","auth_provider"],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User retrieved successfully", user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ UPDATE USER
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.update(updateData);
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { blocked_until } = req.body;

        if (!blocked_until) {
            return res.status(400).json({ message: "Blocked until date is required" });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.update({ blocked_until });

        res.status(200).json({ message: `User blocked until ${blocked_until}` });
    } catch (error) {
        console.error("Error blocking user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ UNBLOCK USER
exports.unblockUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.update({ blocked_until: null });

        res.status(200).json({ message: "User unblocked successfully" });
    } catch (error) {
        console.error("Error unblocking user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.changeUserPassword = async (req, res) => {
    try {
      const { id } = req.params; // ID user yang ingin diubah password-nya
      const { newPassword } = req.body;
  
      if (!newPassword) {
        return res.status(400).json({ message: "New password is required" });
      }
  
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });
  
      res.status(200).json({ message: "Password updated successfully by admin" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  exports.getUserDetails = async (req, res) => {
    try {
      const { id } = req.params;
  
      // ✅ 1. Ambil data user
      const user = await User.findByPk(id, {
        attributes: [
          "id",
          "username",
          "email",
          "phone_number",
          "type",
          "auth_provider",
          "blocked_until",
          "createdAt"
        ]
      });
  
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }
  
      // ✅ 2. Ambil semua post user
      const posts = await Post.findAll({
        where: { user_id: id },
        attributes: ["id", "content","total_likes", "is_pinned", "createdAt"], // ✅ "likes" dihapus
        include: {
          model: PostImage,
          as: "images",
          attributes: ["id", "image"]
        },
        order: [["createdAt", "DESC"]],
      });
      
      
  
      // ✅ 3. Ambil semua laporan user
      const reports = await Report.findAll({
        where: { user_id: id },
        attributes: [
          "id",
          "report_number",
          "title",
          "description",
          "status",
          "date",
          "total_likes",
          "village",
          "location_details",
          "latitude",
          "longitude",
          "createdAt"
        ],
        include: {
          model: ReportAttachment,
          as: "attachments",
          attributes: ["id", "file"]
        },
        order: [["createdAt", "DESC"]],
      });
  
      // ✅ 4. Ambil semua laporan yang disukai user
      const likedReportsRaw = await UserReportLikeHistory.findAll({
        where: { user_id: id },
        include: {
          model: Report,
          as: "report",
          attributes: [
            "id",
            "report_number",
            "title",
            "description",
            "status",
            "date",
            "total_likes",
            "village",
            "location_details",
            "latitude",
            "longitude"
          ],
          include: [
            {
              model: User,
              as: "user", // sesuai dengan relasi yang kamu buat
              attributes: ["id", "username"]
            },
            {
              model: ReportAttachment,
              as: "attachments",
              attributes: ["id", "file"]
            }
          ]
        },
        order: [["createdAt", "DESC"]]
      });
      
  
      const liked_reports = likedReportsRaw.map((item) => item.report);
  
      // ✅ 5. Kirim response lengkap
      return res.status(200).json({
        message: "Detail user berhasil diambil",
        user,
        posts,
        reports,
        liked_reports
      });
  
    } catch (error) {
      console.error("❌ Error fetching user details:", error);
      return res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
  };