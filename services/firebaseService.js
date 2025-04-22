const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-admin-sdk.json'); // 📂 langsung dari file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotificationToUser = async (fcmToken, title, body, data = {}) => {
  const message = {
    token: fcmToken,
    notification: {
      title,
      body,
    },
    data,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notifikasi berhasil dikirim:', response);
  } catch (error) {
    console.error('❌ Gagal mengirim notifikasi:', error);
  }
};

module.exports = { sendNotificationToUser };
