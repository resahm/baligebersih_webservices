const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 5, // Maksimal 5 percobaan login dalam 15 menit
    message: { message: "Too many login attempts. Please try again later." },
    headers: true,
});

module.exports = { loginLimiter };
