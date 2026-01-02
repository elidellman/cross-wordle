import callGemini from "../Gemini/CallGemini.js";

let wordList = [];

const rowLength = 20;
const colLength = 20;

let crosswordMap = Array.from(({length: rowLength}), ()=> Array(colLength).fill(""));
console.log(crosswordMap);

function initalizeMap(wordList){
    //place first word in middle of grid

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

    }

    const firstWord = wordList[wordList.length - 6];


    const middle = Math.floor(rowLength / 2);




    const wordLength = firstWord.length;

    const extraSpace = colLength - wordLength;
    console.log(extraSpace);
    let startWordAtIndex = 0;

    if(extraSpace % 2 === 0){
        startWordAtIndex = extraSpace / 2;
    }else{
        startWordAtIndex = Math.floor(extraSpace / 2);
    }
    console.log(startWordAtIndex);

    const wordArray = Array.from(firstWord);
    console.log(wordArray);

    const newRow = new Array(rowLength).fill("");

    for(let i = 0; i < wordArray.length; i++){
        newRow[startWordAtIndex + i] = wordArray[i];
    }
    console.log(newRow);

    // if there is a word in a spot but is still hidden make it a " "

    crosswordMap[middle] = newRow;



}
function getOverlap(word1, word2){
    console.log("getOverlap");
    console.log(crosswordMap);






    // the best situtation for overlap is where the intersection happens in the most central
    // part of the word

    let biggestSum = {val: 0, letter: ""}

    for(let i = 0; i < word1.length; i++){
        if(word2.includes(word1[i])){
            const commonLetter = word1[i];

            const letterPositionIn1 = i / word1.length;
            const letterPositionIn2 = word2.indexOf(commonLetter) / word1.length;

            const sumPositions = letterPositionIn1 + letterPositionIn2;

            if(sumPositions > biggestSum.val){
                biggestSum.letter = commonLetter;
                biggestSum.val = sumPositions;
            }
            console.log(word1 + " and " + word2 +
                " have " + commonLetter);
        }
    }
}


function createCrossword(){

    console.log("getCrossword");
    console.log(wordList);

    initalizeMap(wordList);



    /*for(let i = 0; i < wordList.length-1; i++){
        for(let j = 0; j < wordleAnswer.length; j++){
            if(i !== j){
                getOverlap(wordList[i], wordList[j]);
            }
        }
    }*/


}

function getCrossword(){
    return crosswordMap;
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
    createCrossword,
    addSynonymsToList,
    resetWordList,
    getCrossword,
}