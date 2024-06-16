const nodemailer = require('nodemailer');

// Konfigurasi Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'efrielsagala@gmail.com',
        pass: 'yugj zscp blbw lvvk'
    }
});

// Fungsi untuk mengirim kode verifikasi
const sendemail = async (email, verificationCode) => {
    const mailOptions = {
        from: 'efrielsagala@gmail.com',
        to: email,
        subject: 'Password Reset Verification Code',
        text: `Your verification code is ${verificationCode}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email berhasil dikirim!');
    } catch (error) {
        console.error('Gagal mengirim email:', error);
        throw error; // Pastikan error dilempar agar bisa ditangani di handler
    }
};

module.exports = {
    sendemail
};
