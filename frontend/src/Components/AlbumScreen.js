import React, {useState} from 'react'
import axios from 'axios'

function AlbumScreen() {

    var [correctness, setCorrectness] = useState("");
    var [correct, setCorrect] = useState("");
    var [numGuesses, setGuesses] = useState(0);
    var [accuracy, setAccuracy] = useState(0.0);
    var [guess, setGuess] = useState("");
    var [track_title, setTrackTitle] = useState("");
    var [lyric, setLyric] = useState("");
    var [answer, setAnswer] = useState("");

    // get lyrics from the album from the csv file
    async function getAlbum() {
        if (answer.toLowerCase().trim() === "taylor swift" || answer.toLowerCase().trim() === "fearless" ||
        answer.toLowerCase().trim() === "speak now" || answer.toLowerCase().trim() === "red" || 
        answer.toLowerCase().trim() === "1989" || answer.toLowerCase().trim() === "reputation") {
            
            const info = await axios.get(`http://localhost:8080/album-lyric/${answer}`);

            setTrackTitle(info.data.track_title);
            setLyric(info.data.lyric);

        }
    }

    // update the users accuracy and set the correct answer to display
    async function updateAccuracy() {
        if (track_title.toLowerCase().trim() === guess.toLowerCase().trim()) {
            setAccuracy(((accuracy * numGuesses) + 1) / (numGuesses + 1));
            setCorrectness("Correct!");
        } else {
            setAccuracy(accuracy * numGuesses / (numGuesses + 1));
            setCorrectness("Wrong");
        }
        setGuesses(numGuesses + 1);
        setCorrect(track_title);

    }


    return (

        <div>

            {lyric === "" && <h2>Pick an album</h2>}

            {lyric === "" && <h3>Choices:</h3>}
            {lyric === "" && <p>Taylor Swift, Fearless, Speak Now, Red, 1989, Reputation</p>}
            {lyric === "" && <input type="text" value={answer} onChange={(e) => {
                setAnswer(e.target.value);
            }}/> }
            {lyric === "" && <button type="submit" onClick={() => {
                getAlbum();
            }}>Submit Album</button>}
        
            <p>{lyric}</p>

            {!(lyric === "") && <p>Guess the song:</p>}

            {!(lyric === "") && <input type="text" value={guess} onChange={(e) => {
                setGuess(e.target.value);
            }}/>}

            {!(lyric === "") && <button type="submit" onClick={() => {
                updateAccuracy();
                getAlbum();
            }}>Submit Guess</button>}

            <p>{correctness}</p> 
            {correctness === "Wrong" && <p>Correct answer: {correct}</p>}
            {numGuesses % 5 === 0 && numGuesses > 0 && <p>Accuracy is {accuracy}</p>}
            {numGuesses % 5 === 0 && numGuesses > 0 && accuracy > 0.75 && <p>Great Accuracy!</p>}
            {numGuesses % 5 === 0 && numGuesses > 0 && accuracy < 0.75 && accuracy > 0.25 && <p>You could improve.</p>}
            {numGuesses % 5 === 0 && numGuesses > 0 && accuracy < 0.25 && <p>Wow you don't know this album.</p>}

        </div>

    )

}

export default AlbumScreen;