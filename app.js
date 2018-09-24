const express = require('express');
const app = express();
const stockname = require("./api/stockname"),
        User       = require("./database/mongomodels/user.js"),
        passport   = require('passport'),
        LocalStrategy =require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        bodyParser  = require('body-parser');

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(require('express-session')({
secret:"RSquare Corporation will be there soon",
resave:false,
saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.static(__dirname + '/styles'));
//app.use(morgan('combined'));
//functions


function isLoggedIn(req,res,next){
if(req.isAuthenticated()){
    return next();
}
res.redirect("/login");
}
        
        

// index page
app.get("/",function(req,res){
    res.render("index",{CurrentUser:req.user});
});
//profile page
app.get("/profile",isLoggedIn,function(req,res){

    res.render("profile",{CurrentUser:req.user});
    
})

//stocks page
app.get("/stocks",function(req,res){
    var bse = req.query.bse;
    res.render("stockpage",{bse:bse,CurrentUser:req.user});
    
});

app.get("/login",function(req,res){
    res.render("login",{CurrentUser:req.user});
});

app.get("/signup",function(req,res){
    res.render("signup",{CurrentUser:req.user});
});
// register route 
app.post("/register",function(req,res){

  console.log(req.body);

    User.register(new User({ 
     emailid:req.body.email
                         }),req.body.password,function(err,user){
                if(err){
                    console.log(err);
                    return res.render("register");
                }
                passport.authenticate("local")(req,res,function(){
                      res.redirect("/profile");
                });
    });
 
 });




//api calls


app.get("/getstockname",function(req,res){
    var data = stockname.stock();
    console.log(data);
    console.log("data got");
    res.send(data);
});


app.listen(3000,function(req,res){
    console.log("server has started");
})