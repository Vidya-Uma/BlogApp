var bodyparser = require("body-parser"),
    methodOverride= require("method-override"),
    mongoose   = require("mongoose"),
    express    = require("express"),
    app        = express();

mongoose.connect("mongodb://localhost:27017/blogApp", { useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use( express.static( "public" ) );
app.use(methodOverride("_method"));

var BlogSchema = new mongoose.Schema({
    title : String,
    image: String,
    body: String,
    created: {type:Date,default:Date.now}
});

var Blog = mongoose.model("Blog",BlogSchema);

app.get("/",function(req, res){
    res.redirect("/blogs");
});
//Index Blog
app.get("/blogs",function(req, res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("err");
        } else {
            res.render("index",{blogs:blogs});
        }
    });
});
//New Blog
app.get("/blogs/new",function(req, res){
     res.render("new");
});
//Create Blog
app.post("/blogs/new",function(req, res){
    Blog.create(req.body.blog,function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});
//Show Blog
app.get("/blogs/:id",function(req, res){
     Blog.findById(req.params.id,function(err, foundBlog){
         if(err){
             res.redirect("/blogs");
         } else {
              res.render("show",{blog:foundBlog});
         }
     })
}); 
//Edit Blog
app.get("/blogs/:id/edit",function(req, res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
             res.render("edit",{blog:foundBlog});
        }
    });
}); 
//Update Blog
app.put("/blogs/:id",function(req, res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatefound){
         if(err){
             res.redirect("/blogs");
         } else {
           res.redirect("/blogs/"+ req.params.id);
         }
    });
});

app.delete("/blogs/:id", function(req, res){
     Blog.findByIdAndRemove(req.params.id,function(err, deletefound){
       if(err){
        res.redirect("/blogs");
         } else {
            res.redirect("/blogs");
          }
     });
 }); 
  //Blog.create({
   // title:"Test Blog",
    // image:"https://www.thesprucepets.com/thmb/sfuyyLvyUx636_Oq3Fw5_mt-PIc=/3760x2820/smart/filters:no_upscale()/adorable-white-pomeranian-puppy-spitz-921029690-5c8be25d46e0fb000172effe.jpg",
     //body:"This is Blog Post", 
//});

app.listen(3000,function(){
    console.log("server is Running");
});