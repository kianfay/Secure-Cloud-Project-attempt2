const express = require("express");
const https = require('https');
const fs = require('fs');
const port = 3030;

var app = express();

app.get('/getPublicKeys', (req, res) => {
  res.send("IT'S WORKING!")
})

const httpsOptions = {
  key: fs.readFileSync('./security/cert.key'),
  cert: fs.readFileSync('./security/cert.pem')
}

https.createServer(httpsOptions, app)
  .listen(port, () => {
      console.log('server running at ' + port)
  })

/* // The first activates some more advanced logging, and then
   // the subsequent lines allow for objects to be recieved
   // by the express router through any verb, POST mostly however.
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  
  // The main settings for the express app routing
  app.use('/users', UserRoute);
  app.use('/messagestore', MessageRoute);
  app.set('port', 3030);
  app.listen(3030); // http://localhost:3030/ */