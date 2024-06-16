const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const authValidate = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(400).json({ message: "masukan token woi" });
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "token udah basi", error: err.message });
        }

        console.log("token benarrrrrr");
        next();
    });
};

module.exports = authValidate;
