import React, {useState}  from "react";
import './App.css';
import crypto from "asymmetric-crypto";
import MainButtons from "./main-buttons/MainButtons.js";
import Download from "./download/Download.js"
import Generate from "./generate/Generate.js"
import Create from "./create/Create.js";
import Insert from "./insert/Insert.js";


function App() {

  const [currentView, setCurrentView] = useState(undefined)
  const [publicKey, setPublicKey] = useState(undefined)
  const [privateKey, setPrivateKey] = useState(undefined)
  const [nameOfUser, setnameOfUser] = useState(undefined)

  function toggleView(view){
    setCurrentView(view)
  }

  function getView(view){
    switch(view){
      case "Download":
        return <Download getPriv={privateKey}/>
      case "Generate":
        return <Generate setPub={setPublicKey} setPriv={setPrivateKey} setName={setnameOfUser}/>
      case "Create":
        return <Create getPriv={privateKey} getPub={publicKey} getName={nameOfUser}/>
      case "Insert":
        return <Insert setPriv={setPrivateKey} setName={setnameOfUser}/>
      default:
        break;
    }
  }

  // If a private key exists but no public key, regenerate the public key
  if(privateKey && !publicKey){
    var pub = crypto.fromSecretKey(privateKey);
    setPublicKey(pub.publicKey)
  }

  return (
    <div className="App">
      <div>
        <h3>Private key entered</h3>
        {privateKey ? "true" : "false"}
        <h3>Public key entered</h3>
        {publicKey ? "true" : "false"}
        <h3>Name entered</h3>
        {publicKey ? ("true" + nameOfUser) : "false"}
      </div>
      <MainButtons toggleView={toggleView}/>
      {getView(currentView)}
    </div>
  );
  
}

export default App;
