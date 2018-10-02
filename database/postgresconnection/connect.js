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



   }


}



