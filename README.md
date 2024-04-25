# Simple App to show Express Session Authentication 

## Install 

- 1- install express session 

```bash 
npm install express-session 
``` 

- 2- add middleware to app.js 
```bash 

const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'your_secret_key',  // Change 'your_secret_key' to a real secret string.
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if you are using HTTPS
}));

```


##  Add session middleware to login 

```bash 

router.post('/login', function(req, res) {
    const { username, password } = req.body;
    // Here you should have your authentication logic
    if (authenticate(username, password)) {
        req.session.isLoggedIn = true;
        req.session.username = username;  // Storing username in session
        res.redirect('/users/todaysphoto');
    } else {
        res.status(401).send('Invalid login');
    }
});

```


##  do not forget we need a user for mock user we added to our router !! 
- in case you do not use database 
```bash 
//sample user 
var users= [
  {
    email:"user@example.com",
    password:"aaaa"
  }
];

function authenticate(email,password)  {
  return users.some(user => user.email === email && user.password === password);
}

```




