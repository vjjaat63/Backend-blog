const JWT = require("jsonwebtoken");
const secret = "Vishal#123";

function createToken(user){
    const payload = {
       _id : user._id,
       fullName : user.fullName,
       email : user.email,
       role : user.role,
       profileImageURL : user.profileImageURL, 
    }

    const token = JWT.sign(payload,secret);
    return token;
}

function verifyToken(token){
    const payload = JWT.verify(token,secret);
    return payload;
}

module.exports = {
    createToken,verifyToken
}