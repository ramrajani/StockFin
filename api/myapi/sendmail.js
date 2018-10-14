var sendgridapikey = require("../../config/auth.json").SENDGRID_API_KEY;
var request = require('request');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgridapikey);

module.exports={


sendmymail:function(req,res){
    console.log(sendgridapikey);
console.log(req.query.htmldata,req.query.email);

    var msg ={
        to: req.query.email,
        from: 'stockfin2018@gmail.com',
        subject:'Portfolio Alert',
        html:'<h1>Your Portfolio</h1>'+req.query.htmldata
    }
    sgMail.send(msg);       
    
    

}

}



