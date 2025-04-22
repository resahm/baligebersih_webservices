const express = require('express');
const router = express.Router();
const parameterController = require('../../controllers/admin/parameter/parameterController');
const isAdmin = require("../../middleware/adminMiddleware");
const authMiddleware = require('../../middleware/authMiddleware'); // middleware verifikasi admin


// ✅ Admin routes
router.post('/', authMiddleware, isAdmin, parameterController.createParameter);
router.get('/', authMiddleware, isAdmin, parameterController.getAllParameter); 
router.put('/:id', authMiddleware, isAdmin, parameterController.updateParameter);
router.delete('/', authMiddleware, isAdmin,     parameterController.deleteParameter);

module.exports = router;
