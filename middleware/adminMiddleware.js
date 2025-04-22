const { User } = require("../models");

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user || user.type !== 1) {
            return res.status(403).json({ message: "Access denied. Only admin can perform this action." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = isAdmin;
