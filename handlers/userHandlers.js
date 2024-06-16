
// const sendemail = require('../services/emailservice');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// const { sendVerificationCode } = require('../services/emailservice');
const postHandler = async (req, res) => {
    try {
        const { password, ...userData } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

     
        console.log('Request body (excluding password):', userData);

        const hashedPassword = await bcrypt.hash(password, 10);

  
        console.log('Data to be created:', { ...userData, password: hashedPassword });

        const data = await User.create({ ...userData, password: hashedPassword });
        res.status(200).json({ status: 'success', message: 'User created successfully', data });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ message: 'Error', error: error.message });
    }
};

module.exports = { postHandler };



const getHandler = async (req, res) => {
    try {
        const data = await User.findByPk(req.params.Nama_Lengkap);
        if (!data) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(400).json({ message: 'Error', error: error.message });
    }
};

const getAllHandler = async (req, res) => {
    try {
        const data = await User.findAll();
        res.status(200).json({ status: 'ok', data });
    } catch (error) {
        res.status(400).json({ message: 'Error', error: error.message });
    }
};

const putPasswordHandler = async (req, res) => {
    const { Nama_Lengkap } = req.params;
    const { oldPassword, newPassword } = req.body;

    try {
        console.log('Mencari pengguna:', Nama_Lengkap);
        const user = await User.findByPk(Nama_Lengkap);
        if (!user) {
            console.log('Pengguna tidak ditemukan');
            return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        }

        if (oldPassword && newPassword) {
            console.log('Membandingkan kata sandi lama');
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                console.log('Kata sandi lama salah');
                return res.status(400).json({ error: 'Kata sandi lama salah' });
            }

            console.log('Meng-hash kata sandi baru');
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            console.log('Kata sandi berhasil diperbarui');
            return res.status(200).json({ message: 'Kata sandi berhasil diperbarui' });
        } else {
            return res.status(400).json({ error: 'Kata sandi lama dan kata sandi baru diperlukan' });
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error.message);
        return res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui', details: error.message });
    }
};


const delHandler = async (req, res) => {
    try {
        const data = await User.findByPk(req.params.Nama_Lengkap);
        if (!data) {
            return res.status(404).json({ message: `No data found with id: ${req.params.Nama_Lengkap}` });
        }
        await data.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error', error: error.message });
    }
};

//buat reset pass

// const resetPasswordHandler = async (req, res) => {
//     const { Nama_Lengkap } = req.params;
//     const { verificationCode, newPassword } = req.body;

//     try {
//         const user = await User.findOne({ where: { Nama_Lengkap } });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         if (user.verificationCode !== verificationCode) {
//             return res.status(400).json({ message: 'Invalid verification code' });
//         }

//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         user.password = hashedPassword;
//         user.verificationCode = null;
//         await user.save();

//         res.status(200).json({ message: 'Password updated successfully' });
//     } catch (error) {
//         console.error('Error in resetting password:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

//percobaan ke 2 reset password
// const sendResetPasswordEmail = require('./sendResetPasswordEmail');

const initiateResetPasswordHandler = async (req, res) => {
    const { email } = req.body;

    console.log('Received request to initiate reset password for:', email);

    try {
        const user = await User.findOne({ where: { Email: email } });

        if (!user) {
            console.log('User not found with Email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user);

        const verificationCode = crypto.randomInt(100000, 999999);
        console.log('Generated verification code:', verificationCode);
        user.verificationCode = verificationCode;
        await user.save();

        console.log('User updated with verification code, sending email...');

        // Konfigurasi Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'efrielsagala@gmail.com',
                pass: 'yugj zscp blbw lvvk'
            }
        });

        const mailOptions = {
            from: 'Aturpola.co.id',
            to: user.Email,
            subject: 'Password Reset Verification Code',
            text: `Your verification code is ${verificationCode}`
        };

        // Mengirim email
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email berhasil dikirim!');
            res.status(200).json({ message: 'Verification code sent to email' });
        } catch (error) {
            console.error('Gagal mengirim email:', error);
            res.status(500).json({ message: 'Failed to send verification email' });
        }

    } catch (error) {
        console.error('Error in initiating reset password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const verifyResetPasswordCodeHandler = async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ where: { Email: email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    initiateResetPasswordHandler
};

module.exports = { postHandler, getHandler, getAllHandler, putPasswordHandler, delHandler,  initiateResetPasswordHandler, verifyResetPasswordCodeHandler };
