const { Op } = require('sequelize');
const { User } = require('../models');
const bcrypt = require('bcryptjs'); // ✅ Tambahkan ini


const findByPhoneOrEmail = async (identifier) => {
    return await User.findOne({
        where: {
            [Op.or]: [{ phone_number: identifier }, { email: identifier }]
        }
    });
};

const getUserById = async (user_id) => {
    return await User.findOne({
        where: { id: user_id },
        attributes: ['id', 'username', 'phone_number', 'email', 'type', 'auth_provider', 'blocked_until','profile_picture', 'is_active'], 
    });
};

const findByUsername = async (username) => {
    return await User.findOne({
      where: { username },
      attributes: ['id', 'username'], 
    });
  };

const findByEmail = async (email) => {
    return await User.findOne({
      where: { email },
      attributes: ['id', 'username', 'email', 'phone_number', 'type', 'auth_provider', 'blocked_until', 'is_active'], 
    });
  };

  const findByPhone = async (phone) => {
    return await User.findOne({
      where: { phone_number: phone },
      attributes: ['id', 'username', 'email', 'phone_number', 'type', 'auth_provider', 'blocked_until', 'is_active'],
    });
  };
  
  


const updateUser = async (user_id, updateData) => {
    const [updated] = await User.update(updateData, { where: { id: user_id } });

    if (!updated) return null; // No update performed

    // ✅ Fetch and return updated user details
    return await User.findOne({ where: { id: user_id }, attributes: ['id', 'username', 'email', 'phone_number'] });
};


const createUser = async (userData) => {
    return await User.create(userData);
};

const changePassword = async (user_id, oldPassword, newPassword) => {
    const user = await User.findByPk(user_id);

    if (!user) {
        throw new Error("User not found");
    }

    // Cek apakah password lama cocok
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error("Old password is incorrect");
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password di database
    await user.update({ password: hashedPassword });

    return { message: "Password changed successfully" };
};


module.exports = { findByPhoneOrEmail, createUser,changePassword,getUserById,updateUser, findByEmail,findByUsername,findByPhone };
