var mongoose=require("mongoose");
   // passportLocalMongoose=require("pasport-local-mongoose");//simplifies building username and password with passport
    
var UserSchema=new mongoose.Schema({
    username:String,
    password:String
})
UserSchema.plugin(require("passport-local-mongoose"));//One can even pass a variable which contains the require statement with proper libraries
module.exports=mongoose.model("User",UserSchema);