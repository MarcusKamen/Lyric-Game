import React, {useState} from 'react'
import axios from 'axios'

function Guess() {

    var [correctAlbum, setCorrectAlbum] = useState("");
    var [correctness, setCorrectness] = useState("");
    var [correct, setCorrect] = useState("");
    var [numGuesses, setGuesses] = useState(0);
    var [accuracy, setAccuracy] = useState(0.0);
    var [guess, setGuess] = useState("");
    var [album, setAlbum] = useState("");
    var [track_title, setTrackTitle] = useState("");
    var [lyric, setLyric] = useState("");

    // get lyrics from musixmatch
    async function getLyric() {
        const ID = (await axios.get(`http://localhost:8080/artist/Taylor%20Swift`)).data;
        const allAlbums = (await axios.get(`http://localhost:8080/albums/${ID}`)).data;
        const rando = Math.floor(Math.random() * allAlbums.ids.length);
        const randomAlbum = allAlbums.ids[rando];
        setAlbum(allAlbums.names[rando]);
        const allTracks = (await axios.get(`http://localhost:8080/track/${randomAlbum}`)).data;
        const rando2 = Math.floor(Math.random() * allTracks.ids.length);
        const randomTrack = allTracks.ids[rando2];
        var goodTrackName = "";
        for (var i = 0; i < allTracks.names[rando2].length; ++i) {
            if (allTracks.names[rando2].at(i) === "(" || allTracks.names[rando2].at(i) === "-") {
                break;
            }
            goodTrackName = goodTrackName + allTracks.names[rando2].at(i);
        }
        setTrackTitle(goodTrackName);
        const allLyrics = (await axios.get(`http://localhost:8080/lyrics/${randomTrack}`)).data;
        const fullLyrics = allLyrics.lyrics;
        const lyricsArray = fullLyrics.split("\n").filter(value => value.length > 0);
        const rando3 = Math.floor(Math.random() * (lyricsArray.length - 4));
        setLyric(lyricsArray[rando3]);
        
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
        setCorrectAlbum(album);

    }
    
    return (
        
        <div>

        {lyric === "" && <button onClick={() => {
            getLyric();
        }}>Get First Lyric</button>}

        <p>{lyric}</p>

        {!(lyric === "") && <p>Guess the song:</p>}

        {!(lyric === "") && <input type="text" value={guess} onChange={(e) => {
            setGuess(e.target.value);
        }}/>}

        {!(lyric === "") && <button type="submit" onClick={() => {
            updateAccuracy();
            getLyric();
        }}>Submit Guess</button>}

        <p>{correctness}</p> 
        {correctness === "Wrong" && <p>Correct answer: {correct}</p>}
        {correctness === "Wrong" && <p>Album: {correctAlbum}</p>}
        {numGuesses % 5 === 0 && numGuesses > 0 && <p>Accuracy is {accuracy}</p>}
        {numGuesses % 5 === 0 && numGuesses > 0 && accuracy > 0.75 && <p>Great Accuracy!</p>}
        {numGuesses % 5 === 0 && numGuesses > 0 && accuracy < 0.75 && accuracy > 0.25 && <p>You could improve.</p>}
        {numGuesses % 5 === 0 && numGuesses > 0 && accuracy < 0.25 && <p>Wow you don't know Taylor Swift lyrics.</p>}
            

        </div>
    );
}

export default Guess;