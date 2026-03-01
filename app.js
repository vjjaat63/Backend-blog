require("dotenv").config();
const express = require("express");
const blogs = require("./models/blog")
const path = require("path");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user")
const blogRoutes = require("./routes/blog")
const { checkAuth } = require("./middleware/user");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT;
const redisClient = require("./config/redis")
// console.log("Connecting to MongoDB with:", process.env.MONGO_URL);

const InitializeConnection = async()=>{
    try{
        
        // // connect to redis
        // await redisClient.connect();
        // console.log("Connected to Redis")
        
        // // connect to DB
        // await mongoose.connect(process.env.MONGO_URL)
        // console.log("✅ MongoDB connected");

        // connecting mongoDB and redis in parallel

        await Promise.all([redisClient.connect(),mongoose.connect(process.env.MONGO_URL)]);

        console.log("Connected to MongoDB and redis");
        app.listen(PORT || 3000,()=>{
            console.log("Listening at port " ,PORT)
        })    }
    catch(err){
        console.log("Failed to connected to DBs : ",err);
    }
}

InitializeConnection();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuth('Token'));
app.use(express.static(path.resolve('./public')))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.get("/", async (req, res) => {
    const allblogs = await blogs.find({});
    return res.render("home", {
        user: req.user,
        blogs: allblogs,
    });

})
