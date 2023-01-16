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
    var [correctSpace, setSpace] = useState(0);
    var [badTrack1, setBadTrack1] = useState("");
    var [badTrack2, setBadTrack2] = useState("");
    var [badTrack3, setBadTrack3] = useState("");
    var [space1, setSpace1] = useState("");
    var [space2, setSpace2] = useState("");
    var [space3, setSpace3] = useState("");
    var [space4, setSpace4] = useState("");
    var [alternate, setAlternate] = useState(0);


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
        var goodTrackName = allTracks.names[rando2];

        setTrackTitle(goodTrackName);
        const allLyrics = (await axios.get(`http://localhost:8080/lyrics/${randomTrack}`)).data;
        const fullLyrics = allLyrics.lyrics;
        const lyricsArray = fullLyrics.split("\n").filter(value => value.length > 0);
        const rando3 = Math.floor(Math.random() * (lyricsArray.length - 4));
        setLyric(lyricsArray[rando3]);
        
    }

    async function getTrack(numOfAnswer) {
        const ID = (await axios.get(`http://localhost:8080/artist/Taylor%20Swift`)).data;
        const allAlbums = (await axios.get(`http://localhost:8080/albums/${ID}`)).data;
        const rando = Math.floor(Math.random() * allAlbums.ids.length);
        const randomAlbum = allAlbums.ids[rando];
        setAlbum(allAlbums.names[rando]);
        const allTracks = (await axios.get(`http://localhost:8080/track/${randomAlbum}`)).data;
        const rando2 = Math.floor(Math.random() * allTracks.ids.length);
        const randomTrack = allTracks.ids[rando2];
        var goodTrackName = allTracks.names[rando2];
        // for (var i = 0; i < allTracks.names[rando2].length; ++i) {
        //     if (allTracks.names[rando2].at(i) === "(" || allTracks.names[rando2].at(i) === "-") {
        //         break;
        //     }
        //     goodTrackName = goodTrackName + allTracks.names[rando2].at(i);
        // }

        if (numOfAnswer === 1) {
            setBadTrack1(goodTrackName);
            if (badTrack1.toLowerCase().trim() === track_title.toLowerCase().trim()) {
                getTrack(1);
            }
        } else if (numOfAnswer === 2) {
            setBadTrack2(goodTrackName);
            if (badTrack2.toLowerCase().trim() === badTrack1.toLowerCase().trim() || 
                badTrack2.toLowerCase().trim() === track_title.toLowerCase().trim()) {
                getTrack(2);
            }
        } else {
            setBadTrack3(goodTrackName);
            if (badTrack3.toLowerCase().trim() === badTrack1.toLowerCase().trim() || 
                badTrack3.toLowerCase().trim() === track_title.toLowerCase().trim() || 
                badTrack3.toLowerCase().trim() === badTrack2.toLowerCase().trim()) {
                getTrack(3);
            }
        }
    }

    async function randomSpot() {
        const rando = Math.floor(Math.random() * 4);
        setSpace(rando);
    }

    async function answer1() {
        if (correctSpace === 0) {
            setSpace1(track_title);
        } else {
            setSpace1(badTrack1);
        }
    }

    async function answer2() {
        if (correctSpace === 0) {
            setSpace2(badTrack1);
        } else if (correctSpace === 1) {
            setSpace2(track_title);
        } else {
            setSpace2(badTrack2);
        }
    }

    async function answer3() {
        if (correctSpace === 0 || correctSpace === 1) {
            setSpace3(badTrack2);
        } else if (correctSpace === 2) {
            setSpace3(track_title);
        } else {
            setSpace3(badTrack3);
        }
    }

    async function answer4() {
        if (correctSpace === 3) {
            setSpace4(track_title);
        } else {
            setSpace4(badTrack3);
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
        setCorrectAlbum(album);
    }
    
    return (
        
        <div>

        {lyric === "" && <button onClick={() => {
            getLyric();
            getTrack(1);
            getTrack(2);
            getTrack(3);
            randomSpot();
        }}>Get First Lyric</button>}

        <p>{lyric}</p>

        {!(lyric === "") && <p>Guess the song:</p>}

        {!(lyric === "") && alternate === 0 && <button type="submit" onClick={() => {
            answer1();
            answer2();
            answer3();
            answer4();
            setAlternate(1);
        }}>Begin</button>}

        {!(lyric === "") && alternate === 1 && <button type="submit" onClick={() => {
            setGuess(space1);
            updateAccuracy();
            getLyric();
            getTrack(1);
            getTrack(2);
            getTrack(3);
            randomSpot();
            setAlternate(0);
        }}>{space1}</button>}


        {!(lyric === "") && alternate === 1 && <button type="submit" onClick={() => {
            setGuess(space2);
            updateAccuracy();
            getLyric();
            getTrack(1);
            getTrack(2);
            getTrack(3);
            randomSpot();
            setAlternate(0);
        }}>{space2}</button>}


        {!(lyric === "") && alternate === 1 && <button type="submit" onClick={() => {
            setGuess(space3);
            updateAccuracy();
            getLyric();
            getTrack(1);
            getTrack(2);
            getTrack(3);
            randomSpot();
            setAlternate(0);
        }}>{space3}</button>}


        {!(lyric === "") && alternate === 1 && <button type="submit" onClick={() => {
            setGuess(space4);
            updateAccuracy();
            getLyric();
            getTrack(1);
            getTrack(2);
            getTrack(3);
            randomSpot();
            setAlternate(0);
        }}>{space4}</button>}

        {/* {!(lyric === "") && <button type="submit" onClick={() => {
            updateAccuracy();
            getLyric();
        }}>Submit Guess</button>} */}

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