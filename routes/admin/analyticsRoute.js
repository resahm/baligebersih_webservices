// routes/admin/analytics.js
const express = require("express");
const router = express.Router();
const AnalyticsController = require("../../controllers/admin/analytics/analyticsController");

router.get("/overview", AnalyticsController.getOverview);

module.exports = router;
