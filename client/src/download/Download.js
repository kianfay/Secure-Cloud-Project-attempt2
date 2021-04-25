import React, {useState}  from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import assCrypto from "asymmetric-crypto";
import CryptoJS, {AES} from "crypto-js";


const getListURL = "https://www.googleapis.com/drive/v3/files?q=%271ZLofZCxq1PHjMBxZvrNbL6kJdNl8cvPc%27%20in%20parents&key=AIzaSyDvvV7UdBteW-MCcyCE5XapxnlVdO4hD90"
var keyStoreRoute = '/getPublicKeys';


function Download(props){
    const [driveListStateToggle, setdriveListStateToggle] = useState(false);
    const [driveListState, setdriveListState] = useState([]);
    const [groupName, setGroupName] = useState({});
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

    if(!driveListStateToggle){
        setdriveListStateToggle(true);
        axios.get(getListURL)
            .then( response => {
                setdriveListState(response.data.files);
                setdriveListStateToggle(true);
                //console.log(response.data.files);
            });
    }
    
    return (
        <div className = "listOfFiles">
            <input 
                type="text" 
                placeholder="Enter group name"
                onInput={e => setGroupName(e.target.value)
            }/>
            <ol>
                {driveListState.map( item => 
                <li key={item.id}>
                    {item.name}
                    <Button onClick={() => getDriveItem(item.id)}>Decrypt and download</Button>
                </li> )}   
            </ol> 
        </div>
    )

    function getDriveItem(id){
        axios.get("https://www.googleapis.com/drive/v3/files/" + id + "?alt=media&key=AIzaSyDvvV7UdBteW-MCcyCE5XapxnlVdO4hD90")
            .then( encryptedFile => {
                //This prints the content of the file to console, for demonstrative puropeses
                console.log(encryptedFile.data)
                
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

                    // Code to decrypt using CryptoJS
                    var decryptedFile = AES.decrypt(encryptedFile.data, decryptedKey).toString(CryptoJS.enc.Utf8);
                    console.log(decryptedFile)
                });
            })
    }
}

export default Download;