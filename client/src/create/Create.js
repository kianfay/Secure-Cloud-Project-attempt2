import React, {useState}  from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import keygen from "keygenerator";
import crypto from "asymmetric-crypto";


var keyStoreRoute = '/getPublicKeys';
var descLine = `Enter a name above, select which users
                you want in the groupm, and click create
                to create the group`

function Create(props){
    const [usersListStateToggle, setusersListStateToggle] = useState(false);
    const [usersListState, setusersListState] = useState([]);
    const [toggledUsers, settoggledUsers] = useState({});
    const [groupName, setGroupName] = useState({});



    if(!usersListStateToggle){
        setusersListStateToggle(true);
        axios.get(keyStoreRoute)
            .then( response => {
                console.log(response.data.keyNamePairs);
                setusersListState(response.data.keyNamePairs);
                setusersListStateToggle(true);
            });
    }


    // <Button onClick={() => getDriveItem(item.id)}>Decrypt and download</Button>
    return (
        <div>
            <ol>
                {usersListState.map( item => 
                <li key={item.name}>
                    {item.name}
                    <Button 
                        variant={toggledUsers[item.name] ? "success" : "primary"}
                        onClick={() => setButtonAndUserState(item.name)}
                        >Include</Button>
                </li> )}   
            </ol>  
            <div>
                <h3>{descLine}</h3>
                <input 
                    type="text" 
                    placholder="Enter group name"
                    onInput={e => setGroupName(e.target.value)}/>
                <Button onClick={createGroup} >Create group</Button>
            </div>
        </div>
    );


    function setButtonAndUserState(name){
        var curToggled = {...toggledUsers};
        curToggled[name] = curToggled[name] ? false : true;
        settoggledUsers(curToggled);
        //console.log(toggledUsers);
    }

    // Filters out the toggled users, resturctures the usersListState object to get the public
    // key with ease, and creates a group using these keys
    function createGroup(){
        var refinedToggledUsers = Object.entries(toggledUsers).filter(x => x[1] === true);

        var reorderdPairs = {};
        for(var i = 0; i < usersListState.length; i++){
            reorderdPairs[usersListState[i].name] = usersListState[i].publicKey;
        }

        // Ends up with an array of arrays, like [["Kanye", "l7dwmCaWX7Wr..."], ["kian", "faswmCaWX7Wr..."]]
        var finalKeyNamePairs = refinedToggledUsers.map(x => [x[0],reorderdPairs[x[0]]])
        finalKeyNamePairs.push([props.getName, props.getPub])
        console.log(finalKeyNamePairs);

        // Create a random asymmetric key
        var asyKey = keygen._();
        console.log("Asymmetric key for group: ")
        console.log(asyKey)

        var newGroup = makeGroup(asyKey, finalKeyNamePairs);

        axios.post('/sendGroup', newGroup);
    }

    // Creates an array of name to encrypted key pairs to be sent to the backend. We add a header
    // to the key, which we must remember to remove after.
    function makeGroup(key, keyNamePairs){
        var headerPlusKey = "OK" + key;
        var keys = keyNamePairs.map(x => [x[0], crypto.encrypt(headerPlusKey, x[1], props.getPriv)])

        var group = {
            name: groupName,
            adminName: props.getName,
            keys: keys
        }

        console.log(group)
        return group;
    }
    
}


export default Create;