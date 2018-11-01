//=====================================
//General Routes
//=====================================
var express=require("express"),
    router=express.Router();
var Campground=require("../models/campground"),
    Comment=require("../models/comment");
var middleware=require("../middleware");

//Index-Route
router.get("/",function(req,res){
    res.render("landing");
})

router.get("/campgrounds",function(req,res){
       Campground.find({},function(err,allCampgrounds){
           if(err){
               console.log(err)
           }else{
               res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});
           }
       });
})
//Create Route
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var price=req.body.price;
    var user={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground={name:name,image:image,description:description,user:user,price:price};
    //create a new campground to save to database
    Campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect to campground page
            res.redirect("/campgrounds");
        }
    })
})

router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
})
//Show Route-- Shows more info about one campground
router.get("/campgrounds/:id",function(req,res){
    //found the campground with id
    Campground.findById(req.params.id).populate("comments").exec(function(err,campground){
        if(err){
            console.log(err);
        }else{
                //render show template with that campground
                //console.log(foundCampground);
                var user=req.user;
                res.render("campgrounds/show",{campground:campground,user:user});
            }
    })
})
//Edit Route
router.get("/campgrounds/:id/edit",middleware.checkUserAuthentication,function(req,res){   
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
    res.render("campgrounds/edit",{campground:campground});
}
    })
})
    //Update Route
router.put("/campgrounds/:id",middleware.checkUserAuthentication,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.data,function(err,campground){
        if(err){
            console.log(err);
        }else{
            //res.send("It has reached the PUT route");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
//Destroy Route
router.delete("/campgrounds/:id",middleware.checkUserAuthentication,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    })
})




module.exports=router;

