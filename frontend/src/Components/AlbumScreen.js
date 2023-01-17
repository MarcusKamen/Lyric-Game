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
    var [correctSpace, setSpace] = useState(0);
    var [badTrack1, setBadTrack1] = useState("");
    var [badTrack2, setBadTrack2] = useState("");
    var [badTrack3, setBadTrack3] = useState("");
    var [space1, setSpace1] = useState("");
    var [space2, setSpace2] = useState("");
    var [space3, setSpace3] = useState("");
    var [space4, setSpace4] = useState("");
    var [alternate, setAlternate] = useState(0);

    // get lyrics from the album from the csv file
    async function getAlbum() {
        if (answer.toLowerCase().trim() === "taylor swift" || answer.toLowerCase().trim() === "fearless" ||
        answer.toLowerCase().trim() === "speak now" || answer.toLowerCase().trim() === "red" || 
        answer.toLowerCase().trim() === "1989" || answer.toLowerCase().trim() === "reputation") {
            
            const info = await axios.get(`http://localhost:8080/album-lyric/${answer}`);

            setTrackTitle(info.data.track_title);
            setLyric(info.data.lyric);

            var equal = false;
            
            var bad1;
            while (!equal) {
                bad1 = (await axios.get(`http://localhost:8080/album-lyric/${answer}`)).data.track_title;
                if (bad1 !== info) {
                    equal = true;
                }
            }

            setBadTrack1(bad1);

            equal = false;

            var bad2;
            while (!equal) {
                bad2 = (await axios.get(`http://localhost:8080/album-lyric/${answer}`)).data.track_title;
                if (bad2 !== bad1 && bad2 !== info) {
                    equal = true;
                }
            }
 
            setBadTrack2(bad2);

            equal = false;

            var bad3;
            while (!equal) {
                bad3 = (await axios.get(`http://localhost:8080/album-lyric/${answer}`)).data.track_title;
                if (bad3 !== bad1 && bad3 !== bad2 && bad3 !== info) {
                    equal = true;
                }
            }

            setBadTrack3(bad3);

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
                randomSpot();
            }}>Submit Album</button>}
        
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
                getAlbum();
                randomSpot();
                setAlternate(0);
            }}>{space1}</button>}


            {!(lyric === "") && alternate === 1 && <button type="submit" onClick={() => {
                setGuess(space2);
                updateAccuracy();
                getAlbum();
                randomSpot();
                setAlternate(0);
            }}>{space2}</button>}


            {!(lyric === "") && alternate === 1 && <button type="submit" onClick={() => {
                setGuess(space3);
                updateAccuracy();
                getAlbum();
                randomSpot();
                setAlternate(0);
            }}>{space3}</button>}


            {!(lyric === "") && alternate === 1 && <button type="submit" onClick={() => {
                setGuess(space4);
                updateAccuracy();
                getAlbum();
                randomSpot();
                setAlternate(0);
            }}>{space4}</button>}

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