const cron = require('node-cron');
const { User } = require('../models');
const { Op } = require('sequelize');

const deleteInactiveUsers = () => {
  cron.schedule('*/10 * * * *', async () => {
    const limitMinutes = 15;
    const cutoff = new Date(Date.now() - limitMinutes * 60 * 1000);

    const deleted = await User.destroy({
      where: {
        is_active: false,
        createdAt: { [Op.lt]: cutoff },
      },
    });

    if (deleted > 0) {
      console.log(`🧹 ${deleted} akun nonaktif berhasil dihapus`);
    }
  });
};

module.exports = deleteInactiveUsers;
