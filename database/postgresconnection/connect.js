const { Pool, Client } = require('pg');
const connectionString = 'postgres://postgres:ram@localhost/stockfindb';


const client = new Client({
  connectionString: connectionString,
})
client.connect();


module.exports={

   reportcard:function(req,res){
     
    var bsecode = req.query.bsecode;
    var today = new Date();
    var yyyy = today.getFullYear();
    var ypm1 = today.getFullYear()-1;
    console.log(yyyy);
    var query = {
      text: 'SELECT p.eps,p.salea,p.netprofit,b.facevalue FROM profitloss'+ypm1+' p LEFT JOIN balancesheet'+ypm1+' b ON p.bse =b.bse WHERE p.bse= $1 ',
      values: [bsecode]
    }

    client.query(query, (err, resp) => {
      console.log(err, resp)
      console.log(resp.rows);
       res.send(resp.rows);
    })



   },
   analyze:function(req,res){
     var query="WHERE";
       var pricerangestart =req.query.pricerangestart;
       var pricerangeend =req.query.pricerangeend;
       
       var epsstart =req.query.epsstart;
       var epsend =req.query.epsend;
          
       var salesstart =req.query.salesstart;
       var salesend =req.query.salesend;
       
       var facevaluestart =req.query.facevaluestart;
       var facevalueend =req.query.facevalueend;
       
       
       var equitystart =req.query.equitystart;
       var equityend =req.query.equityend;
       
       
       if(pricerangestart && pricerangeend){
           query=""
       }else if(epsstart && epsend){
           query=""
       }else if(salesstart && salesend){
           query=""
       }else if(facevaluestart && facevalueend){
           query=""
       }else if(equitystart && equityend){
           query=""
       }
    var today = new Date();
    var yyyy = today.getFullYear();
    var ypm1 = today.getFullYear()-1;
    console.log(yyyy);
    
    
    //query= 'SELECT p.eps,p.salea,p.netprofit,b.facevalue FROM profitloss'+ypm1+' p LEFT JOIN balancesheet'+ypm1+' b ON p.bse =b.bse WHERE p.bse= $1 '
       
        var query = {
      text: 'SELECT p.bsecode  FROM profitloss'+ypm1+' p  WHERE p.eps BETWEEN   $1 and $2',
      values:[epsstart,epsend]
     
    }

    client.query(query, (err, resp) => {
      console.log(err, resp)
      console.log(resp.rows);
       res.send(resp.rows);
    })
       
       
   }


}



