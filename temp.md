//================
//General Packages
//================

var express   =require("express"),
app           =express(),
mongoose      =require("mongoose"),
bodyParser    =require("body-parser"),
seedDB        =require("./seed"),
Comment       =require("./models/comment"),
Campground    =require("./models/campground"),
User          =require("./models/user");

app.use(express.static("public"));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost:27017/Yelp_Camp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));
//=======================
//Authentication packages
//=======================
var expressSession=require("express-session"),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose");
    
    app.use(expressSession({
        secret: "We love each Other",
        resave:false,
        saveUninitialized:false
    }))
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

//app.use(express.static(__dirname + "public"));//check why this statement not working
seedDB();//Seeing the database with dummy data.

//========================
//Authentication Routes
//========================

app.get("/secret",isLoggedIn,function(req,res){
    res.render("authentication/secret");
})

app.get("/signup",function(req,res){
    res.render("authentication/signup")
})

app.post("/signup",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/signup");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secret");
        })
    })
})
//Login Routes
app.get("/login",function(req,res){
    res.render("authentication/login");
})

app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function(req,res){
    console.log("logged-In");
})

app.get("/logout",function(req,res){
    req.logout();
    console.log("Session Expired");
    res.redirect("/login");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        console.log("session created");
        return next();
    }
    res.redirect("/login");
}


//=====================================
//General Routes
//=====================================
app.get("/",function(req,res){
    res.render("landing");
})
app.get("/campgrounds",function(req,res){
       Campground.find({},function(err,allCampgrounds){
           if(err){
               console.log(err)
           }else{
               res.render("campgrounds/index",{campgrounds:allCampgrounds});
           }
       }) 
})

app.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var newCampground={name:name,image:image,description:description};
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

app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
})
//Shows-- Shows more info about one campground
app.get("/campgrounds/:id",function(req,res){
    //found the campground with id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
                //render show template with that campground
                console.log(foundCampground);
                res.render("campgrounds/show",{campground:foundCampground})
            }
    })
})


// ============================
// Comments Routes
// ============================

app.get("/campgrounds/:id/comments/new", function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
        res.render("comments/new",{campground:campground});
        }
    })
})

app.post("/campgrounds/:id/comments",function(req,res){
  Campground.findById(req.params.id, function(err,campground){
      if(err){
          console.log(err);
      }else{
        Comment.create(req.body.data,function(err,comment){
        if(err){
            console.log(err);
        }else{
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
  }
  })
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp version-6")
})