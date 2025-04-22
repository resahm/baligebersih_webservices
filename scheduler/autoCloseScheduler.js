const cron = require('node-cron');
const { autoCloseCompletedReports } = require('../controllers/admin/report/reportController');

// ⏱️ Jadwalkan tiap 1 jam sekali
const scheduleAutoCloseReports = () => {
  cron.schedule('0 * * * *', async () => {
    console.log("🔁 Menjalankan pengecekan auto-close laporan...");
    await autoCloseCompletedReports();
  });
};

module.exports = { scheduleAutoCloseReports };
