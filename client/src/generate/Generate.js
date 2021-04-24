import React, {useState}  from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import crypto from "asymmetric-crypto";

function Generate(props){

    
    const [nameState, setNameState] = useState("")

    var infoLine = `Clicking this button automatically
                   generates a asymmetric key pair, downloads your private key
                   and sends your public key to the server with your name to be
                   stored permanently `

    return(
        <div>
            <input 
                type="text"
                placeholder="Enter name before generating key pair"
                onInput={e => setNameState(e.target.value)}/>
            <h2>{infoLine}</h2>
            <Button onClick={generateKeyPair} >Click to generate a key-pair</Button>
        </div>
    )

    function generateKeyPair(){
        const keyPair = crypto.keyPair();

        var body = {
            "name": nameState,
            "publicKey": keyPair.publicKey
        }
        console.log(keyPair.publicKey)
        axios.post("/sendPublicKeyAndName", body)

        DownloadLocalFile(keyPair.secretKey)
    }

    function DownloadLocalFile(data){
        const element = document.createElement('a');
        const file = new Blob([data]);
        element.href = URL.createObjectURL(file);
        element.download = "privatekey.key";
        document.body.appendChild(element);
        element.click();
    }
    
}

export default Generate;