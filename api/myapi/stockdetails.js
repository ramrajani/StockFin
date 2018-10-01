var cheerio =require('cheerio');
var find=require('cheerio-eq');
var request = require('request');

module.exports={
    bsesite: function(req,res){
        var url="https://beta.bseindia.com/stock-share-price/infosys-ltd/infy/500209/";
        request(url,function(err,response,html){
          if(!err)
          {
            var $ = cheerio.load(html);
            var value = $("body").val();
            console.log(value);
            res.send(value);
          }
                                                   });
    }


}