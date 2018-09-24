var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stockfindb');
var passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = new mongoose.Schema({
    image:String,
    password:String,
    fullname:String,
    country :String,
    city:String,
    state:String,
    occupation:String,
    organization:String,
    emailid:String,
    portfolio:[{
        bsecode:String,
        stockname:String,
        numberofstocks:String,
        boughtat:String
        
    }],
    stocksvisited:[String],    
});

UserSchema.plugin(passportLocalMongoose);

module.exports =mongoose.model("User",UserSchema);

