require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRouter = require('./auth');
const { postHandler, getHandler, getAllHandler, putPasswordHandler, delHandler,  initiateResetPasswordHandler, verifyResetPasswordCodeHandler} = require('./handlers/userHandlers');
const authValidate = require('./middleware/authValidate');
const sequelize = require('./db');
const User = require('./models/User');


const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type']
}));

// Routes
app.use('/auth', authRouter);

app.post('/v1/user', authValidate, postHandler);
app.get('/v1/user', authValidate, getAllHandler); //  semua pengguna
app.get('/v1/user/:Nama_Lengkap', getHandler);
app.put('/v1/user/:Nama_Lengkap', putPasswordHandler);
app.delete('/v1/user/:Nama_Lengkap', delHandler);
// app.post('/v1/user/reset-password/:Nama_Lengkap', resetPasswordHandler);
// app.post('/v1/user/reset-password/initiate/Nama_Lengkap', initiateResetPasswordHandler);
app.post('/v1/user/reset-password', initiateResetPasswordHandler);
app.post('/v1/user/verify-code', verifyResetPasswordCodeHandler);


// Gunakan routes untuk reset password



// Synchronize Sequelize Models with Database
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
