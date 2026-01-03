import callGemini from "../Gemini/CallGemini.js";

let wordList = [];

const rowLength = 20;
const colLength = 20;

function WordOverLap(word1, word2, letter, val){

    this.word1 = word1;
    this.word2 = word2;
    this.letter = letter;
    this.val = val;
}

function Word(word, startXY, isHorizontal){
    this.word = word;
    this.startXY = startXY;
    this.isHorizontal = isHorizontal;
}


let crosswordMap = Array.from(({length: rowLength}), ()=> Array(colLength).fill(""));

// holds their name and start position in the map
let addedWords = []


function initalizeMap(){
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

    let startWordAtIndex = 0;

    if(extraSpace % 2 === 0){
        startWordAtIndex = extraSpace / 2;
    }else{
        startWordAtIndex = Math.floor(extraSpace / 2);
    }

    const wordArray = Array.from(firstWord);

    const newRow = new Array(rowLength).fill("");

    for(let i = 0; i < wordArray.length; i++){
        newRow[startWordAtIndex + i] = wordArray[i];
    }

    // if there is a word in a spot but is still hidden make it a " "

    crosswordMap[middle] = newRow;

    addedWords.push( new Word(firstWord, [middle, startWordAtIndex], true));
    const index = wordList.indexOf(firstWord);
    if(index === -1){
        wordList.splice(index, 1);
    }



}
function getOverlap(word1Object, word2Object){

    const word1 = word1Object.word;
    const word2 = word2Object.word;

    // the best situtation for overlap is where the intersection happens in the most central
    // part of the word

    console.log(word1, word2);


    let biggestSum = new WordOverLap(word1, word2, "", 0);

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
        }
    }
    console.log(biggestSum.val + " at " + biggestSum.letter);
    return biggestSum;
}


function createCrossword(){

    initalizeMap();

    // after a word is added we check against only current words
    // so it starts against just the starting word

    for(let i = 0; i < addedWords.length; i++){
        const word1 = addedWords[i];
        let largestOverlap = { word1: "", word2: "", letter: "", val: 0, isHorizontal: false};
        for(let j = 0; j < wordList.length; j++){
            const word2 = new Word(wordList[j]);
            if(word1 !== word2){

                const currentOverlap = getOverlap(word1, word2);
                if(currentOverlap.val > largestOverlap.val){
                    // check if word will fit in array

                    isRoomForWord(word1, word2, currentOverlap.letter);
                    largestOverlap = currentOverlap;

                }
            }
        }
        console.log("biggest overlap of " + largestOverlap.word1 + " is " +
            largestOverlap.word2  +  " of " + largestOverlap.val + " for " +
            largestOverlap.letter);

    }



}

function isRoomForWord(word1Object, word2Object, letter){

    // we assume that word1 is in the list since its from the list of added words
    console.log("CHECKING IF THERE IS ROOM");

    const word1 = Array.from(word1Object.word);
    const word2 = Array.from(word2Object.word);


    // borders are 00, 0,25, 25,0 and 25,25
    // if any word would go over that it is invalid, this can just be done
    // mathematically


    if(word1Object.isHorizontal){
        // if first word is horizontal, word2 is cutting through it vertically
        // this means the amount of characters it has before the overlap cant go above 0 height
        // and the characters it has below/after the overlap cant go below max height (25)

        const wordHeight = word2.length;
        const indexOfLetterInWord1 = word1.indexOf(letter);

        const charsAfterOverlap = wordHeight - indexOfLetterInWord1;
        const charsBeforeOverlap = wordHeight - charsAfterOverlap;

        console.log(charsBeforeOverlap + "= before | after=" + charsAfterOverlap);

    }else{
        const wordWidth = word2.length;
    }

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