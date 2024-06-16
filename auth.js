const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const USER = "efriel";
const PASSWORD = "sagala";
const SECRET = process.env.SECRET;

const router = express.Router();

router.use(bodyParser.json());

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "bad request",
            error: "Username and password are required"
        });
    }

    if (username !== USER || password !== PASSWORD) {
        return res.status(401).json({
            message: "User Invalid or wrong password"
        });
    }
//masa berlaku jwt tokenya
    const claim = {
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        iss: "test",
        iat: Math.floor(Date.now() / 1000)
    };

    const token = jwt.sign(claim, SECRET);

    return res.status(200).json({
        message: "successfully",
        token: token
    });
});

module.exports = router;
