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

// console.log("Connecting to MongoDB with:", process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        // console.log("✅ MongoDB connected");
        app.listen(PORT, () => {
            // console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
    });


app.use(express.urlencoded({extended : false}));
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
