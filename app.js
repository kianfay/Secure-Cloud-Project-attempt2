const express = require("express");
const https = require('https');
const fs = require('fs');
const port = 3030;

initalKeyStore = 'public-key-store/initialStore.json';
trueKeyStore = 'public-key-store/keys.json';

////
// Setting up an express API, with middleware to parse json body
var app = express();
app.use(express.json());

app.get('/getPublicKeys', (req, res) => {
  res.json({
    "itworks": "IT'S WORKING!"
  })
})

// Fetches the public key store, and appends the new name-key pair
app.post('/sendPublicKeyAndName', (req, res) => {
  console.log(req.body);

  fs.readFile(trueKeyStore, (err, currentPublicKeys) => {
    var JSONcurrentPublicKeys;
    if (err) {
      JSONcurrentPublicKeys = JSON.parse(fs.readFileSync(initalKeyStore));
    } else {
      JSONcurrentPublicKeys = JSON.parse(currentPublicKeys);
    }

    JSONcurrentPublicKeys.keyNamePairs.push({
      name: req.body.publicKey, 
      publicKey: req.body.name
    })

    fs.writeFile(trueKeyStore, JSON.stringify(JSONcurrentPublicKeys), (err) => {
      if(err) throw err;
    })
  })
})


////
// Setting up the https server
const httpsOptions = {
  key: fs.readFileSync('./security/cert.key'),
  cert: fs.readFileSync('./security/cert.pem')
}

https.createServer(httpsOptions, app)
  .listen(port, () => {
      console.log('server running at ' + port);
  })
