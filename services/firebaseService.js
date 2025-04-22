const admin = require('firebase-admin');

// Ambil file serviceAccountKey dari Firebase Console
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

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
    data, // optional untuk payload tambahan
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notifikasi berhasil dikirim:', response);
  } catch (error) {
    console.error('❌ Gagal mengirim notifikasi:', error);
  }
};

module.exports = { sendNotificationToUser };
