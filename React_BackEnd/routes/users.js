var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Test GET request
router.get("/test", function(req, res, next){
  res.render('index', { title: 'Test from Inside Users' });
})

/* POST for newly registered users */
router.post("/register", function(req, res, next){
  //1. Retrieve email and password from req.body

  const email = req.body.email;
  const password = req.body.password;

  console.log(email);
  console.log(password);

  //Verify body
  if(!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed"
    })
    return
  }

  //2. Determine if user already exists in table

    //2.1 If user does not exist, insert into table

    //2.2 If user does exist, return error response

    const queryUsers = req.db.from("users").select("*").where("email", "=", email);
    queryUsers
    .then((users) => {
      if(users.length > 0) {
        res.status(409).json({
          error: true,
          message: "User already exists!"
        })
        return;
      }

      // Insert user into DB
      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds);
      return req.db.from("users").insert({email, hash})
    })
    .catch((err) => {
      console.log(err);
      res.json({"Error" : true, "Message" : err})
    })
    .then(() => {
      res.status(201).json({
        success: true, 
        message: "User created"})
    })


})

/* POST for users trying to login to existing accounts */
router.post("/login", function(req, res, next) {
  //1. Retrieve email and password from req.body

  const email = req.body.email;
  const password = req.body.password;

  //Verify body
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed"
    })
    return
  }

  //2. Determine if user already exists in table

    //2.1 If user does exist, verify if passwords match

      //2.1.1 If passwords match, return JWT token

      //2.1.2 If passwords do not match, return error response

    //2.2 If user does not exist, return error response

    const queryUsers = req.db.from('users').select("*").where("email", "=", email);
    queryUsers
    .then((users) => {
      if(users.length === 0) {
        res.status(401).json({
          error: true,
          message: "Incorrect email or password"
        })
        return;
      }

      //Compare password hashes
      const user = users[0];
      return bcrypt.compare(password, user.hash);
    })
    .then((match) => {
      if(!match) {
        res.status(401).json({
          error: true,
          message: "Incorrect email or password"
        })
        return
      }
      
      //Create and return JWT token
      const secretKey = "secret key";
      const expires_in = 86400;
      const exp = Date.now() + expires_in * 1000;
      const token = jwt.sign({email, exp}, secretKey);
      res.status(200).json({
        token: token,
        token_type: "Bearer",
        expires_in: expires_in})
    })
})

module.exports = router;
