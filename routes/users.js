var express = require('express');
var router = express.Router();
var jsend=require('jsend');
const axios=require('axios');

const NASA_API_KEY="ahxEZ69AEK9CkRCFMf1uexoqGIgrErZyMto4wCaY";

let username="Guest";

router.use(jsend.middleware);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(
    {
      "message":"Welcome to users page",
      "user":req.user
    }
  )
});

router.get('/todaysphoto', async function(req, res, next) {

  if (!req.session.isLoggedIn) {
    res.redirect('/auth/login');
  } else {
  try {
      const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
      // Rendering the 'photoPage' view with the data from the NASA API
      res.render('photopage', { 
          title: response.data.title,
          url: response.data.url,
          explanation: response.data.explanation,
          media_type: response.data.media_type,
          date: response.data.date,
          copyright: response.data.hasOwnProperty('copyright') ? response.datacopyright : 'Unknown',
          username: req.session.user.name,
          userColor: req.session.user.userColor
      });
  } catch (error) {
      console.error('Error fetching data from NASA:', error);
      res.status(500).send("Error fetching data");
  }
  }
});

module.exports = router;
