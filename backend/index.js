
import express from 'express';
import cors from 'cors';

// get wordle

import {getWordle, isValidWordle} from "./Wordle/HandleWordle.js";
import callGemini from "./Gemini/CallGemini.js";
import {createCrossword, getCrossword, resetWordList} from "./Crossword/HandleCrossword.js";
import {addSynonymsToList} from "./Crossword/HandleCrossword.js";


// set this value when getting word, global answer val
let currentWordleAnswer = "";
let crossWordList = [];


// get Crossword will be bellow and call another file

const app = express();
const PORT = 3000;

function resetValues(){
    currentWordleAnswer = "";
    crossWordList = [];
    resetWordList();

    getWordle().then(wordle => {
            currentWordleAnswer = wordle.text;
        }
    );
    console.log(currentWordleAnswer);

}



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

app.get("/api/reset-vals", (req, res) => {
    try {
        resetValues();
        res.json("OK");
    } catch(err) {
        res.json("ERROR");
    }

})

app.get("/api/get-crossword", (req, res) => {
    createCrossword();
    res.json(getCrossword() ? getCrossword() : null);
})

app.get('/', (req, res) => {
    res.send("Hello, this is the not so private NODE JS Cross-Wordle API");
})

app.post("/", (req, res) => {
    res.send("POST Request Called");
})

app.post("/api/is-valid-word", (req, res) => {
    isValidWordle(req.body.answer).then(async (result) => {
        // if word is valid, generate synonyms now
        if (result) {
            console.log(req.body.answer);

            // if word is valid generate and store new words
            if(req.body.answer === currentWordleAnswer){
                await addSynonymsToList(req.body.answer).then((result2) => {
                    console.log(result2);
                });
            }else{
                addSynonymsToList(req.body.answer).then((result2) => {
                    console.log(result2);
                });
            }
            // input is word to generate synonyms/related words for

        } else {
            // dont do anything since word is garbage
        }
        res.send(result);
    });

})

app.get('/api/get-wordle', (req, res) => {
    resetWordList();
    /// DEPRACATED remove this function after debug
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