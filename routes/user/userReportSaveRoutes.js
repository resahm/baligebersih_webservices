const express = require("express");
const router = express.Router();
const userReportSaveController = require("../../controllers/user/save/userReportSaveController");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/", authMiddleware, userReportSaveController.saveReport);
router.get("/", authMiddleware, userReportSaveController.getSavedReports);
router.delete("/:report_id", authMiddleware, userReportSaveController.deleteSavedReport);

module.exports = router;
