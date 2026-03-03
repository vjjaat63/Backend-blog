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
const ratelimiter = require("./middleware/ratelimiter");
// console.log("Connecting to MongoDB with:", process.env.MONGO_URL);

const InitializeConnection = async()=>{
    try{
        // Check if required environment variables are set
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL environment variable is not set");
        }
        
        // connecting mongoDB and redis in parallel
        await Promise.all([redisClient.connect(),mongoose.connect(process.env.MONGO_URL)]);

        console.log("Connected to MongoDB and redis");
        app.listen(PORT || 3000,()=>{
            console.log("Listening at port " ,PORT)
        })    }
    catch(err){
        console.log("Failed to connect to DBs : ",err);
        process.exit(1); // Exit if we can't connect to databases
    }
}

InitializeConnection();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuth('Token'));
app.use(express.static(path.resolve('./public')))
app.use(ratelimiter);

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
