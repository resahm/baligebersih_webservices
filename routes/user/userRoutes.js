const express = require('express');
const userController = require('../../controllers/user/profile/userController');
const authMiddleware = require('../../middleware/authMiddleware'); // ✅ Import middleware untuk otentikasi


const router = express.Router();

// ✅ Buat atau tambahkan informasi user (POST)
router.post('/update', authMiddleware, userController.updateUserInfo);

// ✅ Ambil informasi user yang sedang login (GET)
router.get('/', authMiddleware, userController.getUserInfo);

// ✅ Perbarui informasi user (PUT)
router.put('/update', authMiddleware, userController.updateUserInfo);

router.put('/change-password', authMiddleware, userController.changePassword); 

router.put("/update-profile-picture", authMiddleware, userController.updateProfilePicture);


module.exports = router;
