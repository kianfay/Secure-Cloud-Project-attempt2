import React, {useState} from "react";

function Insert(props){

    const [localNameOfUser, setLocalNameOfUser] = useState(undefined)

    return (
        <div>
            <input 
                type="text" 
                placeholder="Enter name before inserting"
                onChange={e => setLocalNameOfUser(e.target.value)} />
            <input type="file" accept=".key" onChange={e => {
                privKeyToText(e.target.files[0]);
            }}/>
        </div>
    );

    // Converts the private key File type object to the text representation
    function privKeyToText(privKeyFile){
        var fr = new FileReader();

        fr.addEventListener('load', event => {
            var keyfile = event.target.result;
            console.log(keyfile)
            props.setPriv(keyfile)
            props.setName(localNameOfUser);
        })
        fr.readAsText(privKeyFile);
    }
}

export default Insert;