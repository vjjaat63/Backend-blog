const express = require("express")
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment")

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.resolve("./public/uploads"))
    },
    filename : function(req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName)
    }
})

const upload = multer({storage : storage});

router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{
        user : req.user
    });
});

router.get("/:id",async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const Comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    return res.render("blog",{
        blog,
        user : req.user,
        Comments,
    })
})

router.post("/comment/:blogId",async(req,res)=>{
    await Comment.create({
        content : req.body.content,
        blogId : req.params.blogId,
        createdBy : req.user._id,
    })

    const blog = await Blog.findById(req.params.blogId).populate("createdBy");
    const Comments = await Comment.find({ blogId: req.params.blogId }).populate("createdBy");
    return res.redirect(`/blog/${req.params.blogId}`);

})

router.post("/",upload.single('coverImageURL') ,async (req,res) => {

    const {title,body} = req.body;

    const blog = await Blog.create({
        title,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy : req.user._id,
    });
    console.log(blog)
    return res.redirect(`/blog/${blog._id}`)
})
module.exports = router;