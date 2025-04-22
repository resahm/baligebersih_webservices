const otpGenerator = require('otp-generator');
const transporter = require('../config/mailer');
const { t_otp } = require('../models');
const { Op } = require('sequelize');

// Fungsi generate OTP angka saja
const generateNumericOtp = () => {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

// ✅ Kirim OTP berdasarkan tipe ('register' atau 'forgot')
exports.sendOtp = async (email, type = 'register', user_id) => {
  const code = generateNumericOtp();
  const expiredAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit dari sekarang

  await t_otp.create({
    user_email: email,
    code,
    expired_at: expiredAt,
    type,
    user_id, // ✅ simpan user_id
  });

  const subject = type === 'forgot'
    ? 'Kode OTP Reset Password - Balige Bersih'
    : 'Kode OTP Anda - Balige Bersih';

  const title = type === 'forgot'
    ? 'Reset Password'
    : 'Satu langkah lagi untuk mendaftar';

  const message = type === 'forgot'
    ? 'Berikut kode OTP untuk mengatur ulang password Anda:'
    : 'Kami menerima permintaan Anda untuk membuat akun. Berikut kode konfirmasi Anda:';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #1877f2;">${title}</h2>
      <p>Halo,</p>
      <p>${message}</p>
      <div style="font-size: 24px; font-weight: bold; background-color: #f0f2f5; padding: 15px; text-align: center; letter-spacing: 3px; border-radius: 8px; margin: 20px 0;">
        ${code}
      </div>
      <p style="color: red;"><strong>Jangan bagikan kode ini kepada siapa pun.</strong></p>
      <p>Jika seseorang meminta kode ini, terutama jika mereka mengaku dari tim kami, <strong>jangan berikan!</strong></p>
      <p>Terima kasih,<br>Dinas Lingkungan Hidup Toba</p>
    </div>
  `;

  await transporter.sendMail({
    from: '"Balige Bersih" <baligebersih@gmail.com>',
    to: email,
    subject,
    html: htmlContent,
  });

  return true;
};

// ✅ Verifikasi OTP berdasarkan tipe
exports.verifyOtp = async (email, code, type = 'register') => {
  console.log("🔍 Mencari OTP dengan:", { email, code, type });
  
  const otp = await t_otp.findOne({
    where: {
      user_email: email,
      code,
      type,
      is_used: false,
      expired_at: { [Op.gt]: new Date() },
    },
  });

  if (!otp) {
    console.log("❌ OTP tidak ditemukan atau kadaluarsa.");
    return false;
  }

  otp.is_used = true;
  await otp.save();

  console.log("✅ OTP valid dan ditandai sebagai digunakan.");
  return true;
};

// ✅ Kirim ulang OTP berdasarkan tipe
exports.refreshOtp = async (email, type = 'register', user_id) => {
  // Tandai semua OTP lama sebagai digunakan
  await t_otp.update(
    { is_used: true },
    {
      where: {
        user_email: email,
        type,
        is_used: false,
        expired_at: { [Op.gt]: new Date() },
      },
    }
  );

  // Kirim OTP baru
  return await exports.sendOtp(email, type, user_id);
};
