const express = require('express');
const router = express.Router();
const userReportController = require('../../controllers/user/report/reportController');
const authMiddleware = require('../../middleware/authMiddleware'); // Import middleware

// Semua route ini hanya bisa diakses jika user sudah login
router.get('/all', userReportController.getAllReports); // Get semua laporan
router.get('/:id', userReportController.getReportById); // Get laporan by ID

router.post('/create', authMiddleware, userReportController.createReport);
router.put('/:id', authMiddleware, userReportController.updateReport);
router.delete('/:id', authMiddleware, userReportController.deleteReport);
router.get('/:id/report-stats', authMiddleware, userReportController.getReportStats);


module.exports = router;
