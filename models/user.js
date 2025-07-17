const mongoose = require("mongoose");
const {createHmac , randomBytes} = require("crypto");
const { createToken } = require("../services/auth");

const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true,
    },
    email : {
        type: String,
        required: true,
        unique : true,
    },
    salt: {
        type: String,
    },
    password : {
        type : String,
        required : true,
    },
    profileImageURL : {
        type : String,
        default : "./public/images/default.jpg"
    },
    role : {
        type : String,
        enum : ["USER","ADMIN"],
        default : "USER",
    }
},{timestamps : true});


userSchema.pre("save",function(next){
    const user = this;

    if(!user.isModified("password"))
        return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt)
        .update(user.password)
        .digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next();

});

userSchema.static("checkUserAndCreateToken",async function(email,password){
    const user = await this.findOne({ email});
    if (!user)
        throw new Error("User not found!");
    
    const salt = user.salt;
    const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest('hex');
    
    if (user.password !== userProvidedHash)
        throw new Error("wrong Password!");

    const token = createToken(user);
    return token;
})

const user = mongoose.model("user",userSchema);

module.exports = user;