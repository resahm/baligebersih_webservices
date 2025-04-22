const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const userService = require('../../services/userService');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { email, username, idToken, client: clientType } = req.body;

  // 🔐 Validasi request body
  if (!email || !idToken || !clientType) {
    console.log("❌ Missing required fields:", req.body);
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    console.log("🔹 Menerima Google Login Request");
    console.log("🔹 Email:", email);

    // ✅ Verifikasi ID token dari Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      console.log("❌ Token Google tidak valid.");
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    // ✅ Validasi aud & email
    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: 'Invalid token audience' });
    }

    if (payload.email !== email) {
      return res.status(401).json({ message: 'Email mismatch' });
    }

    // 🔍 Cek apakah user sudah ada
    let user = await userService.findByEmail(email);

    // ➕ Jika belum ada, buat user baru
    if (!user) {
      console.log("🔹 User belum ada, membuat akun baru...");
      user = await userService.createUser({
        username: username || email.split('@')[0],
        email,
        phone_number: null,
        password: null,
        type: 0, // Default Flutter user
        auth_provider: 'google',
        is_active: true,
      });
    } else {
      console.log("✅ User ditemukan:", user.email);
      if (user.auth_provider === 'manual') {
        console.log("🔄 Mengubah auth_provider dari manual ke google...");
        await user.update({ auth_provider: 'google' });
      }
    }

    // 🚫 Validasi tipe login
    if (clientType === 'react' && user.type !== 1) {
      return res.status(403).json({ message: "Access denied. Only admin can login on React." });
    }

    if (clientType === 'flutter' && user.type !== 0) {
      return res.status(403).json({ message: "Access denied. Only regular users can login on Flutter." });
    }

    // 🚫 Validasi blokir akun
    const now = new Date();
    const blockedUntil = user.blocked_until ? new Date(user.blocked_until) : null;

    if (blockedUntil && blockedUntil > now) {
      console.log("❌ Akun diblokir hingga", blockedUntil.toISOString());
      return res.status(403).json({
        error: "Akun Anda diblokir",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
          type: user.type,
          auth_provider: user.auth_provider,
          blocked_until: user.blocked_until,
        }
      });
    }

    // ✅ Buat JWT token
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        type: user.type,
        auth_provider: user.auth_provider,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log("✅ Login Google berhasil, token dikirim ke frontend");
    return res.json({
      message: 'Login Google success',
      user,
      token: accessToken,
      refresh_token: refreshToken,
    });

  } catch (error) {
    console.error('❌ Google login error:', error);
    return res.status(500).json({ message: 'Google login failed', error: error.message });
  }
};

module.exports = { googleLogin };
