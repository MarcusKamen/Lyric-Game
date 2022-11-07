const csv = require('csvtojson');
const Path = require('path');
const express = require('express'); 
const cors = require('cors');
const axios = require('axios');

const csvFilePath = Path.join(__dirname, 'taylor_swift_lyrics.csv');
const app = express();
app.use(cors());
app.use(express.json());
 
// get artist ID from musixmatch
app.get('/artist/:artist', async (req, res) => {
    const getRequest = await axios.get(`http://api.musixmatch.com/ws/1.1/artist.search?apikey=c0d59e0eb6da769d7f6c6de9b47707ba&format=json&q_artist=${req.params.artist}&page_size=1`);
    const array = getRequest.data.message.body.artist_list;
    const ID = array[0].artist.artist_id;
    res.json(ID);
});

// get album ID given artist ID from musixmatch
app.get('/albums/:id', async (req, res) => {
    const albums = await axios.get(`http://api.musixmatch.com/ws/1.1/artist.albums.get?apikey=c0d59e0eb6da769d7f6c6de9b47707ba&format=json&artist_id=${req.params.id}&s_release_date=desc&page=1&page_size=1000`);
    const arrayData = albums.data.message.body.album_list;
    const arrayNames = [];
    const arrayIDs = [];
    for (var i = 0; i < arrayData.length; ++i) {
        arrayNames[i] = arrayData[i].album.album_name;
        arrayIDs[i] = arrayData[i].album.album_id;
    }
    res.json({
        names: arrayNames,
        ids: arrayIDs
    });
});

// get track ID given album ID from musixmatch
app.get('/track/:id', async (req, res) => {
    const tracks = await axios.get(`http://api.musixmatch.com/ws/1.1/album.tracks.get?apikey=c0d59e0eb6da769d7f6c6de9b47707ba&format=json&album_id=${req.params.id}&page_size=1000&f_has_lyrics=true`);
    const trackArray = tracks.data.message.body.track_list;
    console.log(trackArray);
    const arrayNames = [];
    const arrayIDs = [];
    for (var i = 0; i < trackArray.length; ++i) {
        arrayNames[i] = trackArray[i].track.track_name;
        arrayIDs[i] = trackArray[i].track.track_id;
    }
    res.json({
        names: arrayNames,
        ids: arrayIDs
    });
});

// get lyrics given track ID from musixmatch
app.get('/lyrics/:id', async (req, res) => {
    const lyricsFull = await axios.get(`http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=c0d59e0eb6da769d7f6c6de9b47707ba&format=json&track_id=${req.params.id}`);
    res.json({
        lyrics: lyricsFull.data.message.body.lyrics.lyrics_body
    });
});

// convert the csv file to a json object
const csvToJson = async () => {
    const songsArray = await csv().fromFile(csvFilePath);
    return songsArray;
}

// get any lyric from the csv file
app.get('/any-lyric', async (req, res) => { 
    const data = await csvToJson(); 
    const rand = Math.round(Math.random() * 4861); 
    var artistLine = data[rand].artist;
    var albumLine = data[rand].album;
    var trackLine = data[rand].track_title;
    var trackNum = data[rand].track_n;
    var lyricLine = data[rand].lyric; 
    var lineNum = data[rand].line;
    var yearLine = data[rand].year;

    res.json({
        "artist": artistLine,
        "album": albumLine,
        "track_title": trackLine,
        "track_num": trackNum,
        "lyric": lyricLine,
        "line": lineNum,
        "year": yearLine
    }); 
});

// get a lyric given the album from the csv file
app.get('/album-lyric/:album', async (req, res) => {
    const data = await csvToJson(); 
    var first = 0;
    var last = 0;
    
    if (req.params.album.toLowerCase().trim() === "taylorswift" || req.params.album.toLowerCase().trim() === "taylor swift") {
        last = 566;
    } else if (req.params.album.toLowerCase().trim() === "fearless") {
        first = 567;
        last = 1128;
    } else if (req.params.album.toLowerCase().trim() === "speaknow" || req.params.album.toLowerCase().trim() === "speak now") {
        first = 1129;
        last = 2058;
    } else if (req.params.album.toLowerCase().trim() === "red") {
        first = 2059;
        last = 2903;
    } else if (req.params.album.toLowerCase().trim() === "1989") {
        first = 2904;
        last = 3856;
    } else if (req.params.album.toLowerCase().trim() === "reputation") {
        first = 3857;
        last = 4861;
    } else {
        res.json({
            "artist": "None",
            "album": "None",
            "track_title": "None",
            "track_num": 0,
            "lyric": "None",
            "line": 0,
            "year": 0
        });
        return;
    }

    const rand = Math.round(Math.random() * (last - first));
    var artistLine = data[rand + first].artist;
    var albumLine = data[rand + first].album;
    var trackLine = data[rand + first].track_title;
    var trackNum = data[rand + first].track_n;
    var lyricLine = data[rand + first].lyric;
    var lineNum = data[rand + first].line;
    var yearLine = data[rand + first].year;

    res.json({
        "artist": artistLine,
        "album": albumLine,
        "track_title": trackLine,
        "track_num": trackNum,
        "lyric": lyricLine,
        "line": lineNum,
        "year": yearLine
    });
});

// print default hello world message
app.get('/', (req, res) => { 
    res.status(200).send({
        Message: 'Hello World'
    });
});

// listen on port 8080
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on ${port}`));