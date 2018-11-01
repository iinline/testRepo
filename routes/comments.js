// ============================
// Comments Routes
// ============================

var express=require("express"),
    router=express.Router();
var Campground=require("../models/campground"),
    Comment=require("../models/comment");
var middleware=require("../middleware");//We donot require middleware/index.js because index,js is a speacial name and when we require middleware(directory), it automatically calls index.js
//New Comment Route
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
        res.render("comments/new",{campground:campground});
        }
    })
})
//Create Comment Route
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
  Campground.findById(req.params.id, function(err,campground){
      if(err){
          console.log(err);
      }else{
        Comment.create(req.body.data,function(err,comment){
        if(err){
            console.log(err);
        }else{
            //add username and id to comments
            comment.author.id=req.user._id;
            comment.author.username=req.user.username;
            //save the comments
            comment.save();
            campground.comments.push(comment);
            campground.save();
            console.log(comment);
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
  }
  })
})
//Edit Comment Route
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.commmentAuthentication,function(req,res){
            Comment.findById(req.params.comment_id,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                        var campId=req.params.id;
                    res.render("comments/edit",{comment:comment,campId:campId});
                }
    })
})
//Update Comment Route
router.put("/campgrounds/:id/comments/:comment_id",middleware.commmentAuthentication,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.data,function(err,comment){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

//Destroy Comment Route
router.delete("/campgrounds/:id/comments/:comment_id",middleware.commmentAuthentication,function(req,res){
   // res.send("Reached the delete Route");
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         console.log("session created");
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports=router;