import React, {useState}  from "react";
import './App.css';
import MainButtons from "./main-buttons/MainButtons.js";
import Download from "./download/Download.js"


function App() {

  const [currentView, setCurrentView] = useState(undefined)

  function toggleView(view){
    setCurrentView(view)
  }

  function getView(view){
    switch(view){
      case "Download":
        return <Download/>
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
