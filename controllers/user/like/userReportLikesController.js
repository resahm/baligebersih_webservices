const { UserReportLikeHistory, Report } = require('../../../models');

exports.likeReport = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { report_id } = req.params;

    // 🔹 Pastikan report_id adalah angka
    if (isNaN(report_id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    // 🔹 Cek apakah laporan ada
    const report = await Report.findByPk(report_id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // 🔹 Cek apakah user sudah like
    const existingLike = await UserReportLikeHistory.findOne({ where: { user_id, report_id } });
    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this report" });
    }

    // 🔹 Tambahkan like ke `t_report_total_likes`
    await UserReportLikeHistory.create({ user_id, report_id });

    // 🔹 Pastikan kolom `total_likes` ada sebelum mengupdate
    if (report.total_likes !== undefined) {
      await report.increment('total_likes');
    }

    return res.status(201).json({ message: "Report liked successfully" });
  } catch (error) {
    console.error("❌ Error liking report:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.unlikeReport = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { report_id } = req.params;

    // 🔹 Pastikan report_id adalah angka
    if (isNaN(report_id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    // 🔹 Cek apakah user pernah like laporan ini
    const like = await UserReportLikeHistory.findOne({ where: { user_id, report_id } });
    if (!like) {
      return res.status(404).json({ message: "You haven't liked this report" });
    }

    // 🔹 Hapus like
    await like.destroy();

    // 🔹 Cek apakah laporan masih ada
    const report = await Report.findByPk(report_id);
    if (report && report.total_likes !== undefined) {
      await report.decrement('total_likes');
    }

    return res.status(200).json({ message: "Like removed successfully" });
  } catch (error) {
    console.error("❌ Error unliking report:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

