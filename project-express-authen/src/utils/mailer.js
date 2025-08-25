const nodemailer = require("nodemailer");

// Tạo transporter để gửi email qua Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// Hàm gửi email
exports.sendMail = async (to, subject, html) => {
    return transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        html,
    })
};