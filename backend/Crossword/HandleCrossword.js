import callGemini from "../Gemini/CallGemini.js";

let wordList = [];

function getCrossword(){

    console.log("getCrossword");
    console.log(wordList);

    if(wordList.length === 0){
        console.log("PLEASE COMPLETE WORDLE FIRST");
        // for debugging purposes,
        wordList = []
        //return;
    }




}


function addSynonymsToList(word){
    callGemini(word).then((result2) => {
        const arr = JSON.parse(result2);
        // generate synonyms of word, add word itself
        wordList.push(word);
        arr.forEach(element => {
            console.log(element);
        })

    })

}

export {
    getCrossword,
    addSynonymsToList,
}