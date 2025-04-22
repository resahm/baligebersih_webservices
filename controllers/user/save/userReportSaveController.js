const { UserReportSave,ReportAttachment, Report, User, ReportStatusHistory } = require("../../../models");

// ✅ Simpan laporan ke daftar favorit
exports.saveReport = async (req, res) => {
  try {
    const { report_id } = req.body;
    const user_id = req.user.id; // Ambil user_id dari token

    if (!report_id) {
      return res.status(400).json({ message: "Report ID is required" });
    }

    // Cek apakah laporan valid
    const report = await Report.findByPk(report_id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Cek apakah laporan sudah disimpan sebelumnya
    const existingSave = await UserReportSave.findOne({ where: { user_id, report_id } });
    if (existingSave) {
      return res.status(400).json({ message: "Report already saved" });
    }

    // Simpan laporan
    const savedReport = await UserReportSave.create({ user_id, report_id });

    res.status(201).json({ message: "Report saved successfully", savedReport });
  } catch (error) {
    console.error("❌ Error saving report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Ambil daftar laporan yang disimpan oleh user
exports.getSavedReports = async (req, res) => {
  try {
    const user_id = req.user.id;

    const savedReports = await UserReportSave.findAll({
      where: { user_id },
      include: [
        {
          model: Report,
          as: "report",
          include: [
            {
              model: ReportAttachment,
              as: 'attachments',
              attributes: ['id', 'file'] // Menampilkan daftar lampiran
            },
            {
              model: ReportStatusHistory, // 🔹 Tambahkan ini agar statusHistory ikut dikembalikan
              as: 'statusHistory',
              include: [
                {
                  model: User,
                  as: 'admin',
                  attributes: ['id', 'username', 'email'] // Tambahkan data admin
                }
              ],
              order: [['createdAt', 'ASC']] // 🔹 Urutkan dari status awal ke terbaru
            }
          ]
        }
      ]
    });

    if (!savedReports.length) {
      return res.status(200).json({ message: "Tidak ada laporan tersimpan", savedReports: [] });
    }

    res.status(200).json({ message: "Saved reports retrieved successfully", savedReports });
  } catch (error) {
    console.error("❌ Error fetching saved reports:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Hapus laporan dari daftar simpanan
exports.deleteSavedReport = async (req, res) => {
  try {
    const { report_id } = req.params;
    const user_id = req.user.id;

    const savedReport = await UserReportSave.findOne({ where: { user_id, report_id } });
    if (!savedReport) {
      return res.status(404).json({ message: "Saved report not found" });
    }

    await savedReport.destroy();
    res.status(200).json({ message: "Saved report deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting saved report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
