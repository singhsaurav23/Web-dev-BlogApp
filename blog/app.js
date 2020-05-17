var express = require("express"),
	app = express(),
    methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
    bodyParser = require("body-parser"),
	mongoose = require("mongoose"); 

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://prosrv:adirav%402000@cluster0-netwk.mongodb.net/test?retryWrites=true&w=majority");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
// 	title: "Be aware of Corona",
//     image: "https://images.unsplash.com/photo-1588774069410-84ae30757c8e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80",
// 	body: "Covid-19 is around 60k in India.Be aware of it!"
// });

app.get("/", function(req, res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
			  if(err) console.log(err);
		else{
			res.render("index",{blogs: blogs});
		}
  });
});

app.get("/blogs/new", function(req,res){
		res.render("new");
		});

app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err,newBlog){
		if(err) res.render("new");
		else res.render("/blogs");
	});
});

app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err) res.redirect("/blogs");
		else{
			res.render("show",{blog: foundBlog}); 
		}
	})
});

app.get("/blogs/:id/edit", function(req, res){
		Blog.findById(req.params.id, function(err, foundBlog){
		if(err) res.redirect("/blogs");
	else res.render("edit",{blog: foundBlog});
	
			});
});

app.put("/blogs/:id", function(req, res){
		req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err) res.redirect("/blogs");
		else res.redirect("/blogs/"+ req.params.id);
	});
});

app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err) res.redirect("/blogs");
		else res.redirect("/blogs");
	});
});
var port = process.env.PORT || 3000;
app.listen(port, function () {

  console.log("The YelpCamp server has started!");

});