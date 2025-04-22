const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded; // Simpan data user dari token ke `req.user`
        next(); // Lanjut ke controller
    } catch (error) {
        return res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = authMiddleware;
