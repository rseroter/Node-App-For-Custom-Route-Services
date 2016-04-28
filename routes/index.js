var express = require('express');
var router = express.Router();

var request = require('request');

//handle all routes
router.get('*', function(req, res, next) {
  
  var sourceHeaders = req.headers;
  delete sourceHeaders["host"];  //causes problems with the forwarded request, for some reason
  
  var targetUrl = sourceHeaders['x-cf-forwarded-url'];
  
  //only making GET requests, could make flexible later
  var options = { method: 'GET',
    url: targetUrl,
    //pass through all headers
    headers: sourceHeaders
   };
   
   console.log('routing to ' + targetUrl);

  //call next service
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        
        //take headers from response and set for proxy response
        res.set(response.headers);
        res.set('proxy-love', 'true');
        res.send(body);
      }
      else {
        console.log('error: ' + error);
        res.status(500).send('Bad things happened!');
      }
  })
});

module.exports = router;
