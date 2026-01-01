import callGemini from "../Gemini/CallGemini.js";

let wordList = [];

function getOverlap(word1, word2){
    // the best situtation for overlap is where the intersection happens in the most central
    // part of the word

    for(let i = 0; i < word1.length; i++){
        if(word2.includes(word1[i])){
            const commonLetter = word1[i];
            console.log(word1 + " and " + word2 +
                "have " + commonLetter);
        }
    }
}


function getCrossword(){

    console.log("getCrossword");
    console.log(wordList);

    if(wordList.length === 0){
        console.log("PLEASE COMPLETE WORDLE FIRST");
        // for debugging purposes,
        wordList = [
            'hello',      'greeting',
            'salutation', 'welcome',
            'hailing',    'knocking',
            'train',      'locomotive',
            'railroad',   'station',
            'carriage',   'track',
            'abcee',      'letters',
            'alphabet',   'literacy',
            'symbols',    'grammar'
        ];

        //return;
    }

    const correctWord = wordList[wordList.length - 6];

    for(let i = 0; i < wordList.length-1; i++){
        getOverlap(wordList[i], wordList[i+1]);
    }

    console.log(correctWord);

}



function resetWordList(){
    wordList = [];
}

async function addSynonymsToList(word){
    const result = await callGemini(word);

    const arr = JSON.parse(result);
    // generate synonyms of word, add word itself
    wordList.push(word);
    arr.forEach(element => {
        wordList.push(element);
    })

    return wordList;

}

export {
    getCrossword,
    addSynonymsToList,
    resetWordList,
}