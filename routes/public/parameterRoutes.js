const express = require('express');
const router = express.Router();
const parameterController = require('../../controllers/admin/parameter/parameterController');

router.get('/', parameterController.getPublicParameter);

module.exports = router;
