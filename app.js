const express = require('express');
const app = express();
const stockname = require("./api/stockname"),
        User       = require("./database/mongomodels/user.js"),
        passport   = require('passport'),
        LocalStrategy =require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        bodyParser  = require('body-parser'),
        stockdetails = require('./api/myapi/stockdetails.js'),
        pgconect  = require("./database/postgresconnection/connect");
var emailsubscribe = require('./api/myapi/sendmail.js');

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
// analysis page
app.get("/analysis",function(req,res){
    res.render("analysis",{CurrentUser:req.user});
})





app.get("/tp",function(req,res){
    res.render("tp");
})





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
     username:req.body.username
                         }),req.body.password,function(err,user){
                if(err){
                    console.log(err);
                    return res.render("signup");
                }
                passport.authenticate("local")(req,res,function(){
                      res.redirect("/profile");
                });
    });
 
 });
// login route
app.post("/login",passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login"
}),function(req,res){


});

// logout route
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});


//--------------------------------------------------------------------------------------

//api calls
app.get("/getstockname",function(req,res){
    var data = stockname.stock();
  
    res.send(data);
});
// get stock report card
app.get("/api/reportcard",pgconect.reportcard);
//filter for analysis page
app.get("/api/filter",pgconect.analyze);
// add to watch list 
app.get("/api/addtowatch",function(req,res){
    var bsecode = req.query.bsecode;
    var username = req.user.username;

    console.log("bse "+bsecode+"  username "+username);

    User.update(
        { username: req.user.username }, 
        { $push: { watchlist: req.query.bsecode } },
        function(err,data){
            console.log(data);
        }
    );

});
// add to portfolio
app.get("/api/addtoportfolio",function(req,res){
    var bsecode = req.query.bsecode;
    var username = req.user.username;
      console.log(req.query);
    console.log("bse "+bsecode+"  username "+username);

    User.update(
        { username: req.user.username }, 
        { $push: { portfolio: {  bsecode:req.query.bsecode,
            stockname:req.query.stockname,
            numberofstocks:req.query.numberofstocks,
            boughtat:req.query.boughtat
          } } },
        function(err,data){
            console.log(data);
        }
    );

})
// get stock by particular bsecode
app.get("/api/stockbybse",pgconect.stockbybse);
// datatable - > balancesheet api with bsecode and year
app.get("/api/datatable/balancesheet",pgconect.balancesheettable);
// datatable - > cashflow api with bsecode and year
//app.get("/api/datatable/cashflow",pgconect.cashflowtable);
// datatable - > profitloss api with bsecode and year
app.get("/api/datatable/profitloss",pgconect.profitlosstable);
// datatable - > quarter api with bsecode and year
//app.get("/api/datatable/quarter",pgconect.quartertable);


//api to send mail of portfolio
app.get("/api/sendmail",emailsubscribe.sendmymail);
//api to get all sectors
app.get("/api/datatable/sectordata",pgconect.sectordata);































app.listen(3000,function(req,res){
    console.log("server has started");
})