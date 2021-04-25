import React, {useState}  from "react";
import './App.css';
import MainButtons from "./main-buttons/MainButtons.js";
import Download from "./download/Download.js"
import Generate from "./generate/Generate.js"
import Create from "./create/Create.js";


function App() {

  const [currentView, setCurrentView] = useState(undefined)

  function toggleView(view){
    setCurrentView(view)
  }

  function getView(view){
    switch(view){
      case "Download":
        return <Download/>
      case "Generate":
        return <Generate/>
      case "Create":
        return <Create/>
      default:
        break;
    }
  }

  return (
    <div className="App">
      <MainButtons toggleView={toggleView}/>
      {getView(currentView)}
    </div>
  );
}

export default App;
