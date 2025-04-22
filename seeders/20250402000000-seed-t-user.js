"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password", 10); // ⬅️ Hash password "password"

    await queryInterface.bulkInsert("t_user", [
      {
        username: "admin",
        email: "admin@baligebersih.com",
        phone_number: "08123456789",
        password: hashedPassword,
        type: 1, // Admin
        blocked_until: null,
        auth_provider: "manual",
        is_active: true,
        fcm_token: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "user",
        email: "user@baligebersih.com",
        phone_number: "08123456789",
        password: hashedPassword,
        type: 0, // User
        blocked_until: null,
        auth_provider: "manual",
        is_active: true,
        fcm_token: null,
        createdAt: new Date(),
        updatedAt: new Date(),  
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("t_user", { username: "admin" });
  },
};
