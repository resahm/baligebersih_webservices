const jwt = require('jsonwebtoken');

const extendTokenIfNeeded = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return next();

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded) return next();

    // ⏳ Hitung sisa waktu token
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp - now;

    // ⏰ Jika token admin tersisa < 5 menit → refresh
    if (decoded.type === 1 && timeLeft < 300) {
      const newToken = jwt.sign(
        {
          id: decoded.id,
          phone_number: decoded.phone_number,
          email: decoded.email,
          username: decoded.username,
          type: decoded.type,
          profile_picture: decoded.profile_picture
        },
        process.env.JWT_SECRET,
        { expiresIn: "60m" }
      );

      // ⛳ Kirim token baru di header (atau cookie)
      res.setHeader("x-new-token", newToken);
    }

    // Lanjut ke route berikutnya
    next();
  });
};

module.exports = extendTokenIfNeeded;
