var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stockfindb');
var passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = new mongoose.Schema({
    email:String,
    password:String,
    fullname:String,
    username:String,
    portfolio:[{
        bsecode:Number,
        stockname:String,
        numberofstocks:Number,
        boughtat:Number
        
    }],
    watchlist:[Number],    
});

UserSchema.plugin(passportLocalMongoose);

module.exports =mongoose.model("User",UserSchema);

