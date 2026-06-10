const JWT = require("jsonwebtoken");

const secret = "Lakshita"

function createUserToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profilePicURL: user.profilePicURL,
        role: user.role,
    }
    const token = JWT.sign(payload, secret, { expiresIn: "1d" });
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createUserToken,
    validateToken
}