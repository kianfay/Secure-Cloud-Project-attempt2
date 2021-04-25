import React, {useState}  from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import CryptoJS, {AES} from "crypto-js";


const getListURL = "https://www.googleapis.com/drive/v3/files?q=%2710FeLrYyczM8yakVDQpfRjVGmOd2vXX_e%27%20in%20parents&key=AIzaSyDvvV7UdBteW-MCcyCE5XapxnlVdO4hD90"

function Download(props){
    const [driveListStateToggle, setdriveListStateToggle] = useState(false);
    const [driveListState, setdriveListState] = useState([]);

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
            .then( response => {
                //This prints the content of the file to console, for demonstrative puropeses
                console.log(response.data)

                // Code to decrypt using CryptoJS
                //var decryptedFile = AES.decrypt(encryptedFile, decryptedKey).toString(CryptoJS.enc.Utf8);
                //console.log(decryptedFile)
            })
    }

}

export default Download;