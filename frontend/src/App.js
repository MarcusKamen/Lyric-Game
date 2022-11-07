import AlbumScreen from './Components/AlbumScreen'
import Guess from './Components/Guess'
import React, {useState} from 'react'

// ask the user if they want to pick an album or not
function App() {
  
  const [answer, setAnswer] = useState("");

  return (
    
    <div>

        {!(answer.toLowerCase().trim() === "y" || answer.toLowerCase().trim() === "n") && <h1>Welcome to the Taylor Swift Game</h1>}
        {!(answer.toLowerCase().trim() === "y" || answer.toLowerCase().trim() === "n") && <p>Would you like to pick an album? y/n</p>}

            
        {!(answer.toLowerCase().trim() === "y" || answer.toLowerCase().trim() === "n") && <input type="text" value={answer} onChange={(e) => {
            setAnswer(e.target.value);
        }}/>}  

        {answer.toLowerCase().trim() === "y" && <AlbumScreen/>}
        {answer.toLowerCase().trim() === "n" && <Guess/>}

    </div>

  );
}

export default App;