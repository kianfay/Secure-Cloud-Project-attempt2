import React from "react";

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

function MainButtons(props){

    return (
      <div>
        <ButtonGroup>
          <Button onClick={() => props.toggleView('Generate')}>Generate key-pair</Button>
          <Button onClick={() => props.toggleView('Insert')}>Insert private key</Button>
          <Button onClick={() => props.toggleView('Download')}>Download</Button>
          <Button onClick={() => props.toggleView('Upload')}>Upload</Button>
          <Button onClick={() => props.toggleView('Create')}>Create group</Button>
          <Button onClick={() => props.toggleView('Modify')}>Modify group</Button>
        </ButtonGroup>
    </div>
    );
}

export default MainButtons;