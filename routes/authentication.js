
//========================
//Authentication Routes
//========================
var express=require("express"),
    router=express.Router();
var Campground=require("../models/campground"),
    comment=require("../models/comment"),
    User=require("../models/user");
var passport=require("passport");


router.get("/signup",function(req,res){
    res.render("authentication/signup")
})

router.post("/signup",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            res.redirect("/signup");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        })
    })
})
//Login Routes
router.get("/login",function(req,res){
    res.render("authentication/login");
})

router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
    console.log("logged-In");
})

router.get("/logout",function(req,res){
    req.logout();
    console.log("Session Expired");
    req.flash("success","Logged You out");
    res.redirect("/login");
})

module.exports=router;