const JWT = require("jsonwebtoken");
const secret = process.env.SECRET;

if (!secret) {
    console.error("ERROR: SECRET environment variable is not set");
    process.exit(1);
}

function createToken(user){
    const payload = {
       _id : user._id,
       fullName : user.fullName,
       email : user.email,
       role : user.role,
       profileImageURL : user.profileImageURL, 
    }

    const token = JWT.sign(payload,secret,{expiresIn : "30m"});
    return token;
}

function verifyToken(token){
    const payload = JWT.verify(token,secret);
    return payload;
}

module.exports = {
    createToken,verifyToken
}