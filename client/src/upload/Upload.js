import React, {useState}  from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import assCrypto from "asymmetric-crypto";
import CryptoJS, {AES} from "crypto-js";

var descLine = `Enter the group name, select a file, and click upload to 
                upoad it to a public google drive folder`;
var keyStoreRoute = '/getPublicKeys';


function Upload(props){

    const [groupName, setGroupName] = useState({});
    const [fileToUpload, setFileToUpload] = useState(undefined);
    const [publicKeysToggle, setpublicKeysToggle] = useState(false);
    const [publicKeys, setPublicKeys] = useState([]);

    if(!publicKeysToggle){
        setpublicKeysToggle(true);
        axios.get(keyStoreRoute)
            .then( response => {
                console.log(response.data.keyNamePairs);
                setPublicKeys(response.data.keyNamePairs);
                setpublicKeysToggle(true);
            });
    }


    return (
        <div>
            <h3>{descLine}</h3>
            <input 
                type="text" 
                placholder="Enter group name"
                onInput={e => setGroupName(e.target.value)}/>
                <input type="file" onChange={e => {
                    fileToBuffer(e.target.files[0]);
                }}/>
            <Button onClick={uploadFile} >Upload file</Button>
        </div>
    );

    function fileToBuffer(file){
        var fr = new FileReader();

        fr.addEventListener('load', event => {
            var bufferedFile = event.target.result;
            console.log(bufferedFile)
            setFileToUpload(bufferedFile);
        })
        fr.readAsDataURL(file);
    }

    function uploadFile(){
        
        axios({
                method: "post",
                url: "/getSpecificGroup",
                data: {
                    groupName: groupName
                }
            })
            .then(response => {
                console.log(response.data)
                if(!response.data || !props.getName){
                    console.log(`Cant process because no data was 
                    returned from the backend or no user name has been entered`);
                    return;
                }

                // Pull out the users encrypted key and nonce, and the admins from the public key store
                var userSymKey = response.data.keys.find(x => x[0] === props.getName)[1]
                console.log("User encrypted symmetric key: ")
                console.log(userSymKey)
                var adminPublicKey = publicKeys.find(x => x.name === response.data.adminName).publicKey
                console.log("Admins public key: ")
                console.log(adminPublicKey)

                var decryptedKeyWithHeader = assCrypto.decrypt(userSymKey.data, userSymKey.nonce, adminPublicKey, props.getPriv);

                var decryptedKey;
                if(decryptedKeyWithHeader.slice(0,2) === "OK"){
                    decryptedKey = decryptedKeyWithHeader.slice(2,decryptedKeyWithHeader.length)
                }

                console.log(decryptedKey)
                
                var encryptedFile = AES.encrypt(fileToUpload, decryptedKey).toString();
                console.log(encryptedFile)

                var decryptedFile = AES.decrypt(encryptedFile, decryptedKey).toString(CryptoJS.enc.Utf8);
                console.log(decryptedFile)

            });
    }
}

export default Upload;