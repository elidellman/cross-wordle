const express = require('express');
const cors = require('cors');

// get wordle
const {getWordle, isValidWordle} = require('./wordle/HandleWordle');
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

app.post("/api/is-valid-word", (req, res) => {
    console.log("hello");
    isValidWordle(req.body.answer).then((result) => {
        console.log(result);
        res.send(result);
    });

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



    const row = Array.from(userAnswer).map((x,indexX) => {

        if(x === currentWordleAnswer[indexX]) {
            return 2;
        }else if(currentWordleAnswer.includes(x)){
            // get location of other letter and check if the user has already put one there
            const currentWordleAnswerArray = Array.from(currentWordleAnswer);

            for(let i = 0; i < currentWordleAnswerArray.length; i++) {
                if(currentWordleAnswerArray[i] === x){
                    if(currentWordleAnswerArray[i] !== userAnswer[i]){
                        return 1;
                    }
                }
            }

        }
        return 0;
    });
    res.send(row);
})


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})