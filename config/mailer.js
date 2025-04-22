// config/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true untuk port 465, false untuk 587
  auth: {
    user: "89c6e9001@smtp-brevo.com", // dari gambar
    pass: "gYQUHFLymtAxdvbn"          // dari gambar
  }
});

module.exports = transporter;






/* 
MANUAL!!!

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'baligebersih@gmail.com',
    pass: 'iviw yyhx geeo cxlb' // pakai App Password Gmail!
  }
});

module.exports = transporter;


 */