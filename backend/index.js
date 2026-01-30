
import express from 'express';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//const base_url = process.env.ENV_URL || "http://localhost:3000";



// get Wordle

import {getWordle, isValidWordle} from "./Wordle/HandleWordle.js";
isValidWordle("hello").then(result=>{
    console.log(result);
});

import {
    compareCrossword,
    createCrossword,
    getCrossword,
    getClue,
    resetWordList,
    setAvailibleWords
} from "./Crossword/HandleCrossword.js";
import {addSynonymsToList} from "./Crossword/HandleCrossword.js";


// set this value when getting word, global answer val
let currentWordleAnswer = "";
let crossWordList = [];

// get Crossword will be bellow and call another file

const app = express();
const PORT = process.env.PORT || 3000;

function resetValues(){
    currentWordleAnswer = "";
    crossWordList = [];
    //resetWordList();

    getWordle().then(wordle => {
            currentWordleAnswer = wordle.text;
        }
    );

}



app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use(cors(
    {
        origin: (origin, callback) => {
            if(process.env.NODE_ENV !== 'production') {
                callback(null, true);
            }

            // allow same origin


            if(origin === 'https://cross-wordle.onrender.com'){
                callback(null, true);
            }



        }
    }
));

app.get("/api/reset-vals", (req, res) => {
    try {
        resetValues();
        getWordle().then(wordle => {
                currentWordleAnswer = wordle.text;
            }
        );
        console.log("answer is" + currentWordleAnswer);

        res.json("OK");
    } catch(err) {
        res.json("ERROR");
    }

})


app.get("/api/create-crossword", (req, res) => {
    createCrossword();

})

app.get("/api/get-crossword", (req, res) => {
    const result = getCrossword();
    //remove later
    if(result.flat().every(e => e === '')){
        createCrossword();
        getCrossword();
    }
    res.json(result ? result : null);

})

app.get("api/compare-crossword", (req, res) => {
    const result = compareCrossword(req.body.text);
    res.send(result);
})



app.post("/", (req, res) => {
    res.send("POST Request Called");
})

app.post("/api/is-valid-word", async (req, res) => {

    console.log(req.body);

    const result = await isValidWordle(req.body.answer);

    if (result) {
        // if word is valid generate and store new words
        if(req.body.answer === currentWordleAnswer){
            await addSynonymsToList(req.body.answer).then((result2) => {
            });
        }else{
            addSynonymsToList(req.body.answer).then((result2) => {
            });
        }
        // input is word to generate synonyms/related words for

    }

    res.send(result);
})

app.post("/api/get-clue", (req, res) => {
    const cords = req.body.text;
    const result = getClue(cords);
    console.log(result);
    res.json(result ? result : null);
})

app.get('/api/get-wordle', (req, res) => {
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