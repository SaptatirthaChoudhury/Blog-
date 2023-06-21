//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');
const ejs = require("ejs");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const Posts1 = {
  Title: 'Introduction to Web3',
  Post: 'Centralization has helped onboard billions of people to the World Wide Web and created the stable, robust infrastructure on which it lives. At the same time, a handful of centralized entities have a stronghold on large swathes of the World Wide Web, unilaterally deciding what should and should not be allowed.'
}
const Posts2 = {
  Title: 'The early Web',
  Post: 'Most people think of the Web as a continuous pillar of modern life—it was invented and has just existed since. However, the Web most of us know today is quite different from originally imagined. To understand this better'
}

let posts = [Posts1,Posts2];



const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/blogDB', { useNewUrlParser: true }).then(() => {
console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});


const blogSchema = new mongoose.Schema({
  titlePost: Object
});

const Blogmodel = mongoose.model("Blogmodel", blogSchema);


app.get("/", (req, res) => {
  Blogmodel.find({}, function (err, foundposts) {
    if (!err) {
      if (foundposts.length === 0) {
        res.render("home", { firstPara: homeStartingContent, defaultcontent: posts, newcontent: foundposts })
      }
      else {
        res.render("home", { firstPara: homeStartingContent, newcontent: foundposts })
      }
    }
  });
});

app.get("/about", (req, res) => {
  res.render('about', { secondPara: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render('contact', { thirdPara: contactContent });
});

app.get("/compose", (req, res) => {
  res.render('compose');
});


app.post("/compose", (req, res) => {
  const blogPost = {
    Title: req.body.titleName,
    Post: req.body.titlePost
  }

  const post = new Blogmodel({
    titlePost: blogPost

  });
  post.save(function (err) {
    if (!err) {
      console.log("blog inserted successfully");
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;

  Blogmodel.find({}, function(err, foundposts){
    if(!err){
      res.render("post", {
     id:requestedPostId,
     newcontent:foundposts
     });
  }
 });

});

app.listen(8000, function () {
  console.log("Server started on port 8000");
});
