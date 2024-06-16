require('dotenv').config();
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    logging: false
});

sequelize.authenticate()
    .then(() => {
        console.log('Koneksi telah berhasil terhubung.');
    })
    .catch(err => {
        console.error('Tidak dapat terhubung ke database:', err);
    });

module.exports = sequelize;
