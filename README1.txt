Marcus Kamen
marcus.p.kamen@vanderbilt.edu

Running the Program:
Open the folder in VS code.
Go to terminal and run:
cd backend
npm install express
npm install cors
npm install csvtojson
npm install axios
node backend.js
Go to another terminal and run:
cd frontend
npm install react
npm install axios
npm start

Reflection:
Since I have never used react, javascript, or HTML before, all of the aspects of this project were new to me.
However, I enjoyed working on this project a lot. Learning about APIs and frontend development, I realized that 
making a website is relatively simple, certainly much easier than I originally thought. I also did not realize 
how common APIs are. While working on the project, I even discovered an API feature on a website I frequent often.

As per my code itself, I went through a few development stages. Before the first workshop, I found some resources
online to help me get started with express, and figured out how to get the backend to print information to localhost.
It took much time to get musixmatch to work, so I eventually settled on musixmatch for any lyric and the csv file
if the user chooses the album. Overall, I thought that this project challenged my coding abilities, but was easily
doable with a little guidance.

If I had more time for this challenge, I would have integrated musixmatch more into my game. I would add another
component screen to ask the user if they want to pick the artist, and call the musixmatch API to get the ID of
the chosen artist. Then, I would continue to prompt the user with lyrics as I already do.