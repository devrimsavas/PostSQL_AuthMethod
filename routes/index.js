var express = require('express');
var router = express.Router();




/* GET home page. */
router.get('/', function(req, res, next) {

  let username="Guest";
  if (req.session.user && req.session.user.name) {
    username=req.session.user.name;
  }
  res.render('index', {
    title:'User Interface',
    username:username
  })
 
});

module.exports = router;
