const express = require('express');
const app = express();

app.set("view engine","ejs");
app.use(express.static(__dirname + '/styles'));

app.get("/",function(req,res){
    res.render("index");
});

app.get("/login",function(req,res){
    res.render("login");
})
app.get("/signup",function(req,res){
    res.render("signup");
})

app.listen(3000,function(req,res){
    console.log("server has started");
})