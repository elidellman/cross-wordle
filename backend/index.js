const express = require('express');
const cors = require('cors');

// get wordle
const getWordle = require('./wordle/getWordle');
// set this value when getting word, global answer val
let currentWordleAnswer = "";

// get crossword will be bellow and call another file

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors(
    {
        origin: (origin, callback) => {
            if(process.env.NODE_ENV !== 'production') {
                callback(null, true);
            }else{
                if(process.env.NODE_ENV === 'production') {
                    if(origin === 'https://urlapp.com'){
                        callback(null, true);
                    }else{
                        callback(new Error('Not Allowed'));
                    }
                }
            }
        }
    }
));


app.get('/', (req, res) => {
    res.send("Hello, this is the not so private NODE JS Cross-Wordle API");
})

app.post("/", (req, res) => {
    res.send("POST Request Called");
})

app.get('/api/get-wordle', (req, res) => {
    // this api call will give a default wordle that does not use the random gen and github list of wordle valid worlds
    // this will need to be implemented tho obviously
    // this is just for testing it consistently with the same word
    // lets say "train"

    getWordle().then(wordle => {
        currentWordleAnswer = wordle.text;
        res.json(wordle);
        }
    );


})

app.post('/api/check-wordle', (req, res) => {
    const userAnswer = req.body.answer;
    console.log("user:" + userAnswer);
    console.log("server: " + currentWordleAnswer);

    if(userAnswer === currentWordleAnswer){
        res.json("CORRECT");

    }else{
        res.json("FALSE");
    }
})


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})