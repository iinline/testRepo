var mongoose =require("mongoose"),
    Campground=require("./models/campground"),
    Comment   =require("./models/comment");
    
    var data=[
    {
        name:"Kharagpur",
        image:" https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZPJ3yTZ636wCxVNJSYLFfIKSltxgxaWdu-MVSjJO8tPK_li4TPA",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name:"Kolkata",
        image:"https://i.ndtvimg.com/i/2017-02/kolkata-metro_650x400_71487448152.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name:"Howrah",
        image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Howrah_bridge_betwixt_Lights.jpg/355px-Howrah_bridge_betwixt_Lights.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
    ]
    
    function seedDB(){
        Campground.remove({},function(err){
            if(err){
                console.log(err);
            }
            console.log("Campgrounds Removed");
            data.forEach(function(seed){
        
            Campground.create(seed,function(err,campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("added a campground");
                    Comment.create({
                        text: "Love My India",
                        author:"Ankit Barnwal"
                    }, function(err,comment){
                        if(err){
                            console.log(err);
                        }else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment");
                        }
                    })
            }
            })
    })
        })
    }
    
    module.exports=seedDB;