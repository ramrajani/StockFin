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
      text: 'SELECT p.eps,p.salea,p.netprofit,b.facevalue,s.name FROM profitloss'+ypm1+' p LEFT JOIN balancesheet'+ypm1+' b ON p.bse =b.bse LEFT JOIN stockname s ON p.bse=s.bse WHERE p.bse= $1 ',
      values: [bsecode]
    }

    client.query(query, (err, resp) => {
      console.log(err, resp)
     
       res.send(resp.rows);
    })



   },
   analyze:function(req,res){
     var query="WHERE";
     var count = req.query.count;
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
      
       
    console.log(pricerangestart && pricerangeend);

       if(pricerangestart && pricerangeend){

           query='s.pricerange BETWEEN '+pricerangestart+' AND '+pricerangeend+' AND';
       }else if(epsstart && epsend){
           query='s.pricerange BETWEEN '+pricerangestart+' AND '+pricerangeend+' AND';
       }else if(salesstart && salesend){
           query=""
       }else if(facevaluestart && facevalueend){
           query=""
       }else if(equitystart && equityend){
           query=""
       }
      query+=' s.price BETWEEN '+pricerangestart+' AND '+pricerangeend+' AND ';
   
   
    if(epsstart && epsend){
      query+=' p.eps BETWEEN '+epsstart+' AND '+epsend+' AND ';
    } 
    console.log(salesstart && salesend)
    if(salesstart && salesend){
     query+=' p.salea BETWEEN '+salesstart+' AND '+salesend+' AND ';
    } 
    console.log(facevaluestart && facevalueend);
    if(facevaluestart && facevalueend){
     query+=' b.facevalue BETWEEN '+facevaluestart+' AND '+facevalueend+' AND ';
    }

    var today = new Date();
    var yyyy = today.getFullYear();
    var ypm1 = today.getFullYear()-1;
    console.log(yyyy);
    
    
    //query= 'SELECT p.eps,p.salea,p.netprofit,b.facevalue FROM profitloss'+ypm1+' p LEFT JOIN balancesheet'+ypm1+' b ON p.bse =b.bse WHERE p.bse= $1 '
    console.log("--------------------------------------");   
    console.log(epsstart,epsend);
    console.log("--------------------");
       

        query=query.substring(0,query.length-4);


        var queryto = {
      text: 'SELECT p.bse,p.eps,p.salea,p.netprofit,b.facevalue,s.name FROM profitloss'+ypm1+' p LEFT JOIN balancesheet'+ypm1+' b ON p.bse =b.bse LEFT JOIN stockname s ON p.bse=s.bse '+query,
     
     
    }

  
      console.log(err,resp);
        var queryto = {
      text: 'SELECT p.bse,p.eps,p.salea,p.netprofit,b.facevalue,s.name FROM profitloss'+ypm1+' p LEFT JOIN balancesheet'+ypm1+' b ON p.bse =b.bse LEFT JOIN stockname s ON p.bse=s.bse WHERE p.bse IN (SELECT p.bse  FROM profitloss'+ypm1+' p  '+query+') ',
     
     
    }
  console.log(queryto); 
    client.query(queryto, (err, resp) => {
    //  console.log(err,resp);

      if(!err){
          if(resp){
           // console.log(resp.rows);
   
            res.send(resp.rows);
            

          }
          
      }
    })
       
       
   }
   
  ,


   stockbybse:function(req,res){

       
    var query = {
      text: 'SELECT name FROM stockname WHERE bse = $1',
      values:[req.query.bsecode]
     
    }

    client.query(query, (err, resp) => {
      console.log("---------------query madharchod -    ----");
      console.log(err,resp);
      console.log("---------------query madharchod -    ----");
      if(!err){

      
          if(resp){
            console.log(resp.rows);
            console.log(resp);
   
            res.send(resp.rows);
            

          }
          
      }
    })


   },

   balancesheettable:function(req,res){

    var year = req.query.year;
    var bsecode = req.query.bsecode;

    var query = {
      text: 'SELECT * FROM balancesheet'+year+' WHERE bse = $1',
      values:[bsecode]
     
    }

    client.query(query, (err, resp) => {
      
      console.log(err,resp);
      
      if(!err){

      
          if(resp){
              if(resp.rows){
                resp.rows[0].year=year;
                console.log(resp.rows);
                console.log(resp);
                 
    
                res.send(resp.rows);
                
              }
            

          }
          
      }
    })




   },
   profitlosstable:function(req,res){

    var year = req.query.year;
    var bsecode = req.query.bsecode;

    var query = {
      text: 'SELECT * FROM profitloss'+year+' WHERE bse = $1',
      values:[bsecode]
     
    }

    client.query(query, (err, resp) => {
      
      console.log(err,resp);
      
      if(!err){

      
          if(resp){
           if(resp.rows){
            resp.rows[0].year=year;
            console.log(resp.rows);
            console.log(resp);
             

            res.send(resp.rows);
            

           }
            

          }
          
      }
    })


   },
   sectordata:function(req,res){

    var query = {
      text: 'SELECT DISTINCT(sector) FROM stockname',
     
     
    }

    client.query(query, (err, resp) => {
      
      console.log(err,resp);
      
      if(!err){

      
          if(resp){
           if(resp.rows){
            resp.rows[0].year=year;
            console.log(resp.rows);
            console.log(resp);
             

            res.send(resp.rows);
            

           }
            

          }
          
      }
    })


   }


}



