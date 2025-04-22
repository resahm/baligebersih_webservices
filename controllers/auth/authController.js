const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../../services/userService');
const { Notification, User } = require('../../models');
const { sendOtp, verifyOtp, refreshOtp } = require('../../services/otpService'); // ✅ import dua-duanya


const register = async (req, res) => {
  try {
    const { phone_number, username, email, password } = req.body;

    if (!phone_number || !username || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // ✅ Cek email apakah sudah digunakan
    const existingEmail = await userService.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: "Email sudah digunakan" });
    }

    // ✅ Cek username apakah sudah digunakan
    const existingUsername = await userService.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ message: "Username sudah digunakan" });
    }

    // ✅ Cek nomor telepon apakah sudah digunakan
    const existingPhone = await userService.findByPhone(phone_number);
    if (existingPhone) {
      return res.status(409).json({ message: "Nomor telepon sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userService.createUser({
      phone_number,
      username,
      email,
      password: hashedPassword,
      type: 0,
      is_active: false, // user belum aktif sampai verifikasi OTP
    });

    await sendOtp(email, 'register', newUser.id);

    await Notification.create({
      title: "Pengguna Baru",
      message: `Akun ${newUser.username} telah mendaftar.`,
      type: "account",
      sent_by: "system",
      role_target: "admin"
    });

    return res.status(201).json({ message: 'OTP telah dikirim ke email', user: newUser });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    const isValid = await verifyOtp(email, code);
    if (!isValid) {
      return res.status(400).json({ message: "OTP tidak valid atau kadaluarsa" });
    }

    const user = await userService.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    user.is_active = true;
    await user.save();

    await Notification.create({
      title: "Akun Aktif",
      message: `Akun ${user.username} telah berhasil diverifikasi.`,
      type: "account",
      sent_by: "system",
      role_target: "admin"
    });

    
    return res.status(200).json({
      message: "✅ Email berhasil diverifikasi dan akun diaktifkan",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        is_active: user.is_active,
      }
    });
    
  } catch (error) {
    console.error("Verifikasi OTP Gagal:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    if (user.is_active) {
      return res.status(400).json({ message: "Akun sudah aktif, tidak perlu verifikasi OTP." });
    }

    await refreshOtp(email);
    res.status(200).json({ message: "✅ OTP baru telah dikirim ke email" });

  } catch (err) {
    console.error("Resend OTP Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const login = async (req, res) => {
    try {
        const { identifier, password, client } = req.body;

        if (!identifier || !password || !client) {
            return res.status(400).json({ message: "Email/Nomor telepon, password, dan tipe klien wajib diisi" });
        }
        
        const user = await userService.findByPhoneOrEmail(identifier);
        if (!user) {
            return res.status(401).json({ message: 'Nomor telepon/email atau password tidak valid' });
        }
        
        if (user.blocked_until && new Date(user.blocked_until) > new Date()) {
            return res.status(403).json({
                message: `Akun Anda diblokir hingga ${user.blocked_until}`
            });
        }

        if (!user.is_active) {
          return res.status(403).json({ message: "Akun belum diverifikasi. Silakan cek email Anda." });
        }
        
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Nomor telepon/email atau password tidak valid' });
        }

        if (client === "react" && user.type !== 1) {
            return res.status(403).json({ message: "Akses ditolak. Anda tidak memiliki izin untuk mengakses sistem ini." });
        }

        if (client === "flutter" && user.type !== 0) {
            return res.status(403).json({ message: "Akses ditolak. Anda tidak memiliki izin untuk mengakses sistem ini." });
        }

        const accessToken = jwt.sign(
            {
                id: user.id,
                phone_number: user.phone_number,
                email: user.email,
                username: user.username,
                type: user.type,
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: client === "react" && user.type === 1 ? "1h" : "30m"
            }
        );

        const userData = {
            id: user.id,
            username: user.username,
            phone_number: user.phone_number,
            email: user.email,
            type: user.type,
            profile_picture: user.profile_picture
        };

        // ✅ Untuk React, cukup kirim access token saja
        if (client === "react") {
            return res.json({
                message: "Login successful",
                user: userData,
                token: accessToken
            });
        }

        // Untuk Flutter, sertakan juga refresh token
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            message: "Login successful",
            user: userData,
            token: accessToken,
            refresh_token: refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Kirim OTP untuk reset password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const user_id = user.id; // 🔥 Ambil user_id dari hasil pencarian
    await sendOtp(email, 'forgot', user_id); // ✅ Kirim OTP beserta user_id

    return res.status(200).json({ message: "Kode OTP telah dikirim ke email Anda" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Verifikasi OTP untuk reset password
const verifyForgotOtp = async (req, res) => {
  const { email, code } = req.body;

  console.log("📨 Cek OTP:", email, code);

  try {
    const isValid = await verifyOtp(email, code, 'forgot');
    if (!isValid) {
      return res.status(400).json({ message: "OTP tidak valid atau telah kadaluarsa" });
    }

    return res.status(200).json({ message: "OTP valid. Silakan atur ulang password Anda." });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Atur ulang password baru
const resetPassword = async (req, res) => {
  const { email, new_password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const hashed = await bcrypt.hash(new_password, 10);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ message: "Password berhasil diperbarui. Silakan login kembali." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔁 Kirim ulang OTP untuk lupa password
const resendForgotOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    await refreshOtp(email, 'forgot'); // Gunakan type 'forgot' di sini

    return res.status(200).json({ message: "OTP baru telah dikirim ulang ke email Anda." });
  } catch (error) {
    console.error("Resend Forgot OTP Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};





const logout = (req, res) => {
    if (req.cookies && req.cookies.refreshToken) {
        res.clearCookie("refreshToken");
    }
    res.status(200).json({ message: "Logout successful" });
};

//jangan gunakan di flutter
const refreshToken = (req, res) => {
    console.log("🟢 [DEBUG] Request Headers:", req.headers);
    console.log("🟢 [DEBUG] Request Body:", req.body);
    console.log("🟢 [DEBUG] Request Cookies:", req.cookies);

    let refreshToken;

    if (req.cookies && req.cookies.refreshToken) {
        refreshToken = req.cookies.refreshToken;  // React menggunakan cookies
    } else if (req.body && req.body.refresh_token) {
        refreshToken = req.body.refresh_token;  // Flutter menggunakan body request
    }

    if (!refreshToken) {
        console.log("❌ Tidak ada refresh token di request!");
        return res.status(401).json({ message: "No refresh token found" });
    }

    console.log("🔄 [DEBUG] Verifying refresh token:", refreshToken);

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("❌ [DEBUG] Invalid refresh token!");
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        console.log("✅ [DEBUG] Refresh token valid! Mengirim access token baru.");
        return res.json({ access_token: newAccessToken, refresh_token: refreshToken });
    });
};



module.exports = { register, login, logout, refreshToken, verifyEmailOtp, resendOtp, forgotPassword, verifyForgotOtp, resetPassword, resendForgotOtp }; 
