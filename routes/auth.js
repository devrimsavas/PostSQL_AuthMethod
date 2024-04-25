

var express = require('express');
var router = express.Router();
var jsend=require('jsend');
var bodyParser = require('body-parser');
var db=require('../models');
var crypto=require('crypto');
var UserService=require('../services/UserService');
var userService=new UserService(db);

//sample user 
var users= [
  {
    name:"john doe",
    email:"user@example.com",
    password:"aaaa",
    userColor:"green"
  }
];

function authenticate(email, password) {
  // Passwords should be hashed and checked here
  return users.find(user => user.email === email && user.password === password);
}


//it is a test line for nodemon
router.use(jsend.middleware);

/* GET home page. */
router.get('/login', function(req, res, next) {  
  res.render('login', { title: 'login' });
});

// Login POST
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.jsend.fail({
      statusCode: 400,
      result: "Please provide email and password"
    });
  }

  try {
    const user = await userService.getOne(email);
    if (!user) {
      return res.jsend.fail({
        statusCode: 400,
        result: "User not found so try again "
      });
    }
    
    // Verify the hashed password
    const hash = crypto.pbkdf2Sync(password, user.salt, 310000, 32, 'sha256');
    if (hash.toString() === user.encryptedPassword.toString()) {
      req.session.isLoggedIn = true;
      req.session.user = {
          name: user.name,
          email: user.email,
          userColor: user.userColor
      };
      res.redirect('/users/todaysphoto');
    } else {
      res.status(401).jsend.fail('Invalid login');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).jsend.error('Internal server error');
  }
});

// Logout
router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/auth/login');
  });
});



router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'signup' });
    
});


//create a new user 
router.post('/signup', async  (req,res,next) => {

    const {username,email,password,userColor}=req.body;

    console.log(username,email,password);

    if (!username || !email || !password || !userColor ) {
        return res.jsend.fail({
            status:400,
            message:"Please provide username, email and password"
        });
    }
    try {
      const existingUser=await userService.getOne(email);
      if (existingUser) {
        return res.jsend.fail({
          statusCode:400,
          result:"User already exists"
        });
      }
      const salt=crypto.randomBytes(16);
      crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.jsend.error({
            statusCode:500,
            message : 'Error hashing password'
          });
        }

        try {
           userService.create(username,email,hashedPassword,salt,userColor);
          res.jsend.success({
            statusCode:200,
            result:"User created successfully"
          });
        } catch(error) {
          console.error('Error creating user:', error);
          res.jsend.error({
            statusCode:500,
            message:'Internal server error'
          });
        }


      });

    } catch(error) {
      console.error('Error fetching user:', error);
      res.jsend.error({
        statusCode:500,
        message:'Internal server error'
      });


    }




});




module.exports = router;
