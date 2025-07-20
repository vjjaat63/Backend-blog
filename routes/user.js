const express = require("express");
const User = require("../models/user");
const { createHmac } = require("crypto");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.resolve("./public/profileImages"))
    },
    filename : function(req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
})

const upload = multer({storage})
const router = express.Router();

router.get("/signin",(req,res)=>{
    return res.render("signin");
})

router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.post("/signin",async(req,res)=>{
    const {email,password} = req.body;
    try {
        const token = await User.checkUserAndCreateToken(email,password);
        return res.cookie("Token",token).redirect("/");
    } 
    catch (error) {
        return res.render("signin",{
            error : "Invalid e-mail or password"
        })
    }

    // const userMail = req.body.email;
    // const userPassword = req.body.password;

    // console.log(userMail,userPassword);
    // const user = await User.findOne({email : userMail});
    // if(!user)
    //     return res.end("User not found !");

    // const salt = user.salt;
    // const hashedPassword = createHmac("sha256",salt)
    //     .update(userPassword)
    //     .digest('hex');

    // if(user.password !== hashedPassword)
    //         return res.end("wrong Password");
    
    // return res.render("home");
})

router.post("/signup",upload.single("profileImageURL"),async(req,res)=>{
    const {fullName,email,password} = req.body;
    const profileImageURL = req.file
        ? `/profileImages/${req.file.filename}`
        : `/profileImages/default.png`;

        await User.create({
            fullName,
            email,
            password,
            profileImageURL,
        });

    return res.redirect("/user/signin");
}) 

router.get("/logout",(req,res)=>{
    res.clearCookie('Token').redirect("/");
})


module.exports = router;