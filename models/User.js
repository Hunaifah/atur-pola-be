const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    Nama_Lengkap: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Jenis_Kelamin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Goals: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Berat_Badan: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    Tinggi_Badan: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    Umur: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    verificationCode: {
        type: DataTypes.INTEGER,
        allowNull: true // Kode verifikasi dapat kosong saat pengguna tidak lupa password
    }
});

module.exports = User;
