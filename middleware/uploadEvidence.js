const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder tujuan ada
const uploadPath = 'uploads/evidences';
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const uploadEvidence = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5 MB
});

module.exports = uploadEvidence;
