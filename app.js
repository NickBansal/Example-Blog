var expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();


//APP CONFIG
mongoose.connect("mongodb://localhost/sun_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


// MODEL/MONGOOSE CONFIG
var blogSchema = new mongoose.Schema({
    title:      String,
    image:      String, 
    body:       String, 
    author:     String,
    created:    {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema); 


// RESTFUL ROUTES

app.get("/", function(req, res){
    res.render("enter");
})

// INDEX ROUTE
app.get("/sun", function(req, res){
    Blog.find({}, function(err, blogs){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});      
        }
    })
});


// NEW ROUTE
app.get("/sun/new", function(req, res){
    res.render("new");
})


// CREATE ROUTE
app.post("/sun", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/sun")
            console.log(req.body.blog.image)
        }
    })
})


// SHOW ROUTE
app.get("/sun/:id", function(req, res){
    // Blog.findById(id, callback)
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect("/sun");
        } else {
            res.render("show", {foundBlog: foundBlog});
        }
    });
});


// EDIT ROUTE
app.get("/sun/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect("/sun");
        } else {
            res.render("edit", {foundBlog: foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/sun/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err) {
            res.redirect("/sun");
        } else {
            res.redirect("/sun/" + req.params.id);
        }
    });
});


// DELETE ROUTE
app.delete("/sun/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/sun");
        } else {
            res.redirect("/sun")
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is Running!")
});