const { User, Report, ReportAttachment, ReportStatusHistory, Notification, ReportEvidence, UserReportSave  } = require('../../../models');
const { sequelize } = require('../../../models');
const { Op } = require("sequelize");
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Konfigurasi Multer untuk Upload File
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/reports/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).array('attachments', 5); // Maksimal 5 file



exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'] // Hanya ambil data user yang diperlukan
        },
        {
          model: ReportAttachment,
          as: 'attachments', // ✅ Pastikan alias ini sesuai dengan model
          attributes: ['file'], // Hanya ambil kolom file
        },
        {
          model: ReportStatusHistory,
          as: 'statusHistory',
          include: [
            {
              model: User,
              as: 'admin',
              attributes: ['id', 'username', 'email'] // Admin yang mengubah status
            }
          ],
          attributes: ['id', 'previous_status', 'new_status', 'message', 'createdAt'], // Ambil hanya kolom penting
          order: [['createdAt', 'DESC']], // Urutkan status dari yang terbaru
        },
        {
          model: ReportEvidence,
          as: 'evidences',
          attributes: ['id', 'file'] // ✅ Tambahkan ini
        }
      ],
      order: [['createdAt', 'DESC']] // Urutkan laporan dari yang terbaru
    });

    console.log("🔥 Debugging Backend - Semua Reports dengan statusHistory:", JSON.stringify(reports, null, 2));

    res.status(200).json({
      message: 'Data laporan berhasil diambil',
      reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
};


// ✅ Get laporan berdasarkan ID
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        },
        {
          model: ReportAttachment,
          as: 'attachments',
          attributes: ['id', 'file']
        },
        {
          model: ReportStatusHistory,
          as: 'statusHistory',
          include: {
            model: User,
            as: 'admin',
            attributes: ['id', 'username', 'email']
          },
          attributes: ['id', 'previous_status', 'new_status', 'message', 'createdAt']
        },
        {
          model: ReportEvidence,
          as: 'evidences', // ⬅️ Tambahkan ini
          attributes: ['id', 'file']
        }
      ]
    });

    if (!report) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    res.status(200).json({
      message: 'Detail laporan berhasil diambil',
      report
    });
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
};




// ✅ CREATE REPORT (Hanya User yang Login)
exports.createReport = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload error", error: err.message });
    }

    console.log("🔍 [DEBUG] Data dari request body:", req.body); // ✅ Cek apakah location_details dikirim


    const { title, description, location_details, village, longitude, latitude, is_at_location, date } = req.body;
    const user_id = req.user.id; // Ambil ID user dari token

    if (!title || !description || !date) {
      return res.status(400).json({ message: "Judul, deskripsi, dan tanggal wajib diisi" });
    }

    try {
      // Ambil bulan dan tahun dari tanggal laporan
      const reportDate = new Date(date);
      const month = String(reportDate.getMonth() + 1).padStart(2, "0"); // MM
      const year = reportDate.getFullYear(); // YYYY

      // Ambil jumlah laporan yang sudah dibuat dalam bulan ini
      const existingReports = await Report.count({
        where: {
          date: {
            [Op.between]: [
              new Date(`${year}-${month}-01 00:00:00`),
              new Date(`${year}-${month}-31 23:59:59`),
            ],
          },
        },
      });

      // Format nomor laporan: BB-MMYYYY-XXXX
      const report_number = await generateUniqueReportNumber(date);


      const result = await sequelize.transaction(async (t) => {
        const newReport = await Report.create(
          {
            user_id,
            report_number, // Gunakan nomor laporan yang baru dibuat
            title,
            description,
            status: "pending",
            total_likes: 0,
            date, // Pastikan `date` tidak null
            location_details: location_details && location_details.trim() !== "" ? location_details.trim() : null, // ✅ Pastikan nilainya dikirim dan disimpan dengan benar
            village: is_at_location === "false" ? village : null,
            latitude: is_at_location === "true" ? latitude : null,
            longitude: is_at_location === "true" ? longitude : null,
          },
          { transaction: t }
        );

        const user = await User.findByPk(user_id);

        await Notification.create({
          user_id: null, // Dikirim ke admin
          title: "Laporan Baru",
          message: `Pengguna ${user.username} telah mengirim laporan baru dengan judul "${title}".`,
          type: "report",
          sent_by: "system",
          role_target: "admin"
        });
        
        await Notification.create({
          user_id, // Notifikasi ke user itu sendiri
          title: "Laporan Sedang Diperiksa",
          message: `Laporan Anda dengan nomor ${report_number} telah berhasil dikirim dan sedang diperiksa oleh tim Dinas Lingkungan Hidup Toba.`,
          type: "report",
          sent_by: "system",
          report_id: newReport.id,
          role_target: "user"
        },{transaction : t});
        

        if (req.files.length > 0) {
          const attachments = req.files.map((file) => ({
            report_id: newReport.id,
            file: `uploads/reports/${file.filename}`,
          }));

          await ReportAttachment.bulkCreate(attachments, { transaction: t });
        }

        return newReport;
      });

      const reportWithAttachments = await Report.findByPk(result.id, {
        include: { model: ReportAttachment, as: "attachments" },
      });

      console.log("✅ [DEBUG] Data yang disimpan:", reportWithAttachments);

      console.log("🛠 Data disimpan:", {
        title, description, date, location_details, village, latitude, longitude, is_at_location
      });
      

      res.status(201).json({ message: "Laporan berhasil dibuat!", report: reportWithAttachments });
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
  });
};

async function generateUniqueReportNumber(date) {
  const reportDate = new Date(date);
  const month = String(reportDate.getMonth() + 1).padStart(2, "0"); // MM
  const year = reportDate.getFullYear(); // YYYY
  let counter = 1;
  let report_number;

  while (true) {
    report_number = `BB-${month}${year}-${String(counter).padStart(4, "0")}`;
    const existingReport = await Report.findOne({ where: { report_number } });
    if (!existingReport) {
      break; // Jika tidak ada, berarti unik
    }
    counter++; // Kalau sudah ada, coba nomor berikutnya
  }

  return report_number;
}

// ✅ UPDATE REPORT (Hanya Bisa Jika Status Masih `pending` dan User yang Sama)
exports.updateReport = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload error', error: err.message });
    }

    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const { title, description, location_details, village, longitude, latitude, is_at_location, delete_attachments } = req.body;

      const report = await Report.findByPk(id, {
        include: { model: ReportAttachment, as: 'attachments' }
      });

      if (!report) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

      if (report.status !== 'pending') {
        return res.status(400).json({ message: 'Laporan hanya bisa diedit jika masih dalam status pending' });
      }

      if (report.user_id !== user_id) {
        return res.status(403).json({ message: 'Anda tidak memiliki izin untuk mengedit laporan ini' });
      }

      // Update laporan
      report.title = title || report.title;
      report.description = description || report.description;
      report.location_details = location_details || report.location_details;

      const isAtLocation = is_at_location === true || is_at_location === 'true';

      if (isAtLocation) {
        report.longitude = longitude;
        report.latitude = latitude;
        report.village = null;
      } else {
        report.longitude = null;
        report.latitude = null;
        report.village = village || report.village;
      }

      await report.save();

      // ✅ Hapus attachment lama jika diminta
      if (delete_attachments) {
        const attachmentsToDelete = JSON.parse(delete_attachments);
        for (const attachmentId of attachmentsToDelete) {
          const attachment = await ReportAttachment.findByPk(attachmentId);
          if (attachment) {
            try {
              fs.unlinkSync(attachment.file); // Hapus file dari sistem
            } catch (err) {
              console.error(`Gagal menghapus file ${attachment.file}:`, err.message);
            }
            await attachment.destroy(); // Hapus dari database
          }
        }
      }

      // ✅ Tambahkan attachment baru (jika ada file diunggah)
      if (req.files.length > 0) {
        const newAttachments = req.files.map((file) => ({
          report_id: report.id,
          file: `uploads/reports/${file.filename}`
        }));
        await ReportAttachment.bulkCreate(newAttachments);
      }

      // Ambil laporan yang telah diperbarui dengan attachments terbaru
      const updatedReport = await Report.findByPk(id, {
        include: { model: ReportAttachment, as: 'attachments' }
      });

      res.status(200).json({ message: 'Laporan berhasil diperbarui', report: updatedReport });

    } catch (error) {
      console.error('Error updating report:', error);
      res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
  });
};

// ✅ DELETE REPORT (Hanya Bisa Jika Status Masih `pending` dan User yang Sama)
exports.deleteReport = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const report = await Report.findByPk(id);

    if (!report) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    if (report.status !== 'pending') {
      return res.status(400).json({ message: 'Laporan hanya bisa dihapus jika masih dalam status pending' });
    }

    if (report.user_id !== user_id) {
      return res.status(403).json({ message: 'Anda tidak memiliki izin untuk menghapus laporan ini' });
    }

    await ReportAttachment.destroy({ where: { report_id: id } }); // Hapus attachment jika ada
    await report.destroy();

    res.status(200).json({ message: 'Laporan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
};

exports.getReportStats = async (req, res) => {
  const userId = req.params.id;

  try {
    console.log("📌 USER ID DARI PARAM:", userId);

    const sent = await Report.count({ where: { user_id: userId } });

    const completed = await Report.count({
      where: {
        user_id: userId,
        status: {
          [Op.or]: ['completed', 'closed']
        }
      }
    });

    const saved = await UserReportSave.count({ where: { user_id: userId } });

    console.log("📊 Jumlah:", { sent, completed, saved });

    res.json({ data: { sent, completed, saved } });
  } catch (err) {
    console.error("❌ Error getReportStats:", err.message);
    res.status(500).json({ error: 'Gagal mengambil statistik laporan.' });
  }
};


