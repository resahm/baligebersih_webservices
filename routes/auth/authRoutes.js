const express = require('express');
const authController = require('../../controllers/auth/authController');
const authMiddleware = require('../../middleware/authMiddleware'); 
const { loginLimiter } = require('../../middleware/rateLimiter'); // Import rate limiter
const { googleLogin } = require('../../controllers/auth/authGoogleController');


const router = express.Router();

router.post('/register', authController.register);
router.post('/login', loginLimiter,authController.login);
router.post('/logout', authController.logout);

router.post('/refresh-token', authController.refreshToken);

router.post('/google', googleLogin);

router.post('/verify-email-otp', authController.verifyEmailOtp); 

router.post('/resend-otp', authController.resendOtp);


router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-forgot-otp', authController.verifyForgotOtp);
router.post('/reset-password', authController.resetPassword);
router.post('/resend-forgot-otp', authController.resendForgotOtp);



module.exports = router;
