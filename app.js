const express = require("express");
const https = require('https');
const fs = require('fs');
const port = 3030;

initalKeyStore = 'public-key-store/initialStore.json';
trueKeyStore = 'public-key-store/keys.json';

initialGroupStore = 'group-store/initialStore.json';
trueGroupStore = 'group-store/groups.json';

////
// Setting up an express API, with middleware to parse json body
var app = express();
app.use(express.json());

app.get('/getPublicKeys', (req, res) => {
  
  fs.readFile(trueKeyStore, (err, currentPublicKeys) => {
    var JSONcurrentPublicKeys;
    if (err) {
      console.log("A keystore must be generated. Do this by generating a key at teh frontend.")
    } else {
      JSONcurrentPublicKeys = JSON.parse(currentPublicKeys);
    }
    res.json(JSONcurrentPublicKeys);
  })
})

// Fetches the public key store, and appends the new name-key pair
app.post('/sendPublicKeyAndName', (req, res) => {

  fs.readFile(trueKeyStore, (err, currentPublicKeys) => {
    var JSONcurrentPublicKeys;
    if (err) {
      JSONcurrentPublicKeys = JSON.parse(fs.readFileSync(initalKeyStore));
    } else {
      JSONcurrentPublicKeys = JSON.parse(currentPublicKeys);
    }

    JSONcurrentPublicKeys.keyNamePairs.push({
      name: req.body.name, 
      publicKey: req.body.publicKey,
    })

    fs.writeFile(trueKeyStore, JSON.stringify(JSONcurrentPublicKeys), (err) => {
      if(err) throw err;
    })
  })
  res.send("200 OK");
})

app.post('/sendGroup', (req, res) => {

  fs.readFile(trueGroupStore, (err, currentGroups) => {
    var JSONcurrentGroups;
    if (err) {
      JSONcurrentGroups = JSON.parse(fs.readFileSync(initialGroupStore));
    } else {
      JSONcurrentGroups = JSON.parse(currentGroups);
    }

    if(checkFormatAndName(JSONcurrentGroups.groups, req.body)){
      JSONcurrentGroups.groups.push(req.body)
      fs.writeFile(trueGroupStore, JSON.stringify(JSONcurrentGroups), (err) => {
        if(err) throw err;
      })
      res.send("200 OK");
    } else {
      console.log("Attempt made to overwrite a group")
      res.send("409 Conflict");
    }
  })
})

function checkFormatAndName(groups, newGroup){
  console.log(groups);
  var takenNames = groups.map(x => x.name);
  if(takenNames.includes(newGroup.name)){
    return false;
  } else {
    return true;
  }
}

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
