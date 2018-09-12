const express = require('express');
const app = express();
const stockname = require("./api/stockname");

app.set("view engine","ejs");
app.use(express.static(__dirname + '/styles'));


app.get("/",function(req,res){
    res.render("index");
});


app.get("/stocks",function(req,res){
    var bse = req.query.bse;
    res.render("stockpage",{bse:bse});
    
});



app.get("/login",function(req,res){
    res.render("login");
})
app.get("/signup",function(req,res){
    res.render("signup");
})




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