const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const adminReportController = require('../../controllers/admin/report/reportController');
const isAdmin = require("../../middleware/adminMiddleware"); 
const uploadEvidence = require('../../middleware/uploadEvidence'); // ✅ pastikan path benar



router.get('/',  authMiddleware, isAdmin, adminReportController.getAllReports);
router.get('/:id', authMiddleware, isAdmin, adminReportController.getReportById);
router.delete('/:id', authMiddleware, isAdmin, adminReportController.deleteReport);


router.put('/:id/status', authMiddleware, isAdmin, uploadEvidence.array('evidences'), adminReportController.updateReportStatus);


module.exports = router;
