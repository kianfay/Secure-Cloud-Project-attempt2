import React, {useState}  from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import crypto from "asymmetric-crypto";

function Generate(props){

    var infoLine = `Clicking this button automatically
                   generates a asymmetric key pair, downloads your private key
                   and sends your public key to the server with your name to be
                   stored permanently `

    return(
        <div>
            <h2>{infoLine}</h2>
            <Button onClick={generateKeyPair} >Click to generate a key-pair</Button>
        </div>
    )

    function generateKeyPair(){
        const keyPair = crypto.keyPair();
        var body = {
            "name": "sample",
            "publicKey": keyPair.publicKey
        }
        console.log(keyPair.publicKey)
        axios.post("/sendPublicKeyAndName", body)
    }
}

export default Generate;