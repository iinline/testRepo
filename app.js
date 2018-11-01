var express   =require("express"),
app           =express(),
mongoose      =require("mongoose"),
bodyParser    =require("body-parser"),
flash         =require("connect-flash"),
methodOverride=require("method-override"),
seedDB        =require("./seed"),
Comment       =require("./models/comment"),
Campground    =require("./models/campground"),
User          =require("./models/user");

var commentRoutes=require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds"),
    authenticationRoutes=require("./routes/authentication");

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
mongoose.connect("mongodb://ankit:ankit7mongodb@ds133113.mlab.com:33113/yelpcamp", { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost:27017/Yelp_Camp", { useNewUrlParser: true });
// mongodb://<dbuser>:<dbpassword>@ds133113.mlab.com:33113/yelpcamp

// mongoose.connect(process.env.DATABASEURL,{ useNewUrlParser: true });
// mongodb://ankit:ankit7mongodb@ds133113.mlab.com:33113/yelpcamp

console.log(process.env.DATABASEURL);
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
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
    
    app.use(function(req,res,next){
        res.locals.currentUser=req.user;
        res.locals.error=req.flash("error");
        res.locals.success=req.flash("success");
        next();
    })
    // app.use(function(req,res,next){
    //     res.locals.currentCampground=req.campground;
    //     next();
    // })
//app.use(express.static(__dirname + "public"));//check why this statement not working
//seedDB();//Seeing the database with dummy data.


app.use("/",commentRoutes);//By adding "/xyx", it automatically prefixes all routes inside the commentRoutes so that all routes start with "/xyz", this can be done when there is a repetition of code(to dry up the code).
app.use("/",campgroundRoutes);
app.use("/",authenticationRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp version-10")
})