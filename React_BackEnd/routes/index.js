var express = require('express');
const mysql = require('mysql');
var router = express.Router();

const jwt = require('jsonwebtoken');

let re = /[A-Z]{5}/;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET stocks/symbols */

router.get("/stocks/symbols", function(req, res, next) {
  
  if(req.param("industry"))
  {

    //Filter for Industry
    req.db.from('stocks').distinct('name', 'symbol', 'industry').where('industry', 'like', `%${req.query.industry}%`)
    .then((rows) => {
      
      if(rows == '')
      {
        res.status(404).json({"error": true, "message" : "Industry sector not found"})
      } else {
        res.status(200).json(rows)
      }
      
    })
    .catch((err) => {
      console.log(err);
      res.json({
        "error" : true, 
        "message" : "Error in MySQL Query where there is a parameter",
        "outcome" : err
      })
    })
  }
  else if(!req.query.industry)
  {
    //If there is no industry parameter
    if (Object.keys(req.query).length === 0)
    {
      //Display all the stocks
    req.db.from('stocks').distinct('name', 'symbol', 'industry')
    .then((rows) => {
      res.status(200).json(rows)
    })
    .catch((err) => {
      console.log(err);
      res.json({"error" : true, "message" : "Error in MySQL Query where there is no parameter"})
    })
    //Otherwise the query parameter is not for industry
    }
    else{
      res.status(400).json({
        "error": true,
        "message": "Invalid query parameter: only 'industry' is permitted"
      })
    }
    
  }
})

/* GET stocks/{symbol} */

router.get("/stocks/:Symbol", function(req,res,next) {
  
  //If the user attempts a query for the non-authed route
  if(req.query.from || req.query.to)
  {
    res.status(400).json(
      {
        "error": true,
        "message": "Date parameters only available on authenticated route /stocks/authed"
      }
    )
  }
  else
  {
    req.db.from('stocks').distinct('timestamp', 'symbol', 'name', 'industry','open', 'high', 'low', 'close', 'volumes').where('Symbol', '=', req.params.Symbol)
  .then((rows) => {

    if(rows == '')
      {
        res.status(404).json({"error": true, "message" : "No entry for symbol in stocks database"})
      } else {
        res.status(200).json(rows[0])
      }

  })
  .catch((err) => {
    console.log(err);
    res.json({"error" : true, "message" : "Error executing MySQL query"})
  })

  }
  
  
});

const authorize = (req, res, next) => {
  const authorization = req.headers.authorization;
  let token = null;
  
  // Retrieve token
  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1];
    //Need to change this to res.status
    console.log("Token: ", token);
  } else {
    res.status(403).json({
      error: true,
      "message": "Authorization header not found"
    })
    return;
  }

  //Verify JWT and check expiration date
  try {
    const secretKey = "secret key";
    const decoded = jwt.verify(token, secretKey);

    if(decoded.exp < Date.now()) {
      //Need to change this to res.status
      console.log("Token has expired")
      return
    }

    //Permit user to advance to route
    next()
  } catch(e) {
    //Need to change this to res.status
    console.log("Token is not valid: ", e)
  }
}



/* GET stocks/authed/{symbol} */
router.get("/stocks/authed/:Symbol", authorize, function(req,res,next) {


  //If there exists a parameter for the 'From' and 'To' values
  if(req.query.from && req.query.to)
  {
    //If the user is not authorised, deny their attempt
    if(!authorize)
    {
      res.status(403).json({
      "error" : true,
      "message" : "Authorization not found"
      })
    }
    //Allow an attempt at date parameters
    else
    {
      const from = req.query.from;
      const to = req.query.to;
      req.db.from('stocks').distinct('timestamp', 'symbol', 'name', 'industry','open', 'high', 'low', 'close', 'volumes').where('Symbol', '=', req.params.Symbol).whereBetween('timestamp', [from, to])
    .then((rows) => {
      //If there are no entries within those dates
      if(rows == ''){
        res.status(404).json({
          Error: true,
          "message": 'No entries available for query symbol for supplied date range'
        })
      } 
      //If there are entries (e.g. valid paramaters)
      else{
        res.status(200).json(rows)
      }
    })
    }

    
  }
  //If there are not any 'From' or 'To' parameters
  else {

    //If there are no query parameters at all
    if(req.query === 0)
    {
      req.db.from('stocks').distinct('timestamp', 'symbol', 'name', 'industry','open', 'high', 'low', 'close', 'volumes').where('Symbol', '=', req.params.symbol)
      .then((rows) => {
      res.status(200).json(rows)
        })
      .catch((err) => {
        console.log(err);
        res.json({"error" : true, "message" : "Error executing MySQL query"})
        })
    }
    //The parameters must be incorrect
    else
    {
      res.status(400).json({
        "error" : true,
        "message" : "Parameters allowed are 'from' and 'to', example: /stocks/authed/AAL?from=2020-03-15"
      })
    }
    
  }
      
});


module.exports = router;
