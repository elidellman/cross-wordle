import callGemini from "../Gemini/CallGemini.js";

let availableWordList = [];
let overlapTiles = []

const rowLength = 20;
const colLength = 20;

function WordOverLap(word1, word2, letter, val){

    this.word1 = word1;
    this.word2 = word2;
    this.letter = letter;
    this.val = val;
}

function Word(word, startRowCol, isHorizontal){
    this.word = word;
    this.row = startRowCol[0];
    this.col = startRowCol[1];
    this.isHorizontal = isHorizontal;
}


let crosswordMap = Array.from(({length: rowLength}), ()=> Array(colLength).fill(""));

// holds their name and start position in the map
let addedWords = []


function initalizeMap(){
    //place first word in middle of grid
    console.log("INITALIZATION IS CALLED");
    availableWordList = [
        'hello',      'greeting',
        'salutation', 'welcome',
        'hailing',    'knocking',
        'train',      'locomotive',
        'railroad',   'station',
        'carriage',   'truck',
        'abcee',      'letters',
        'alphabet',   'literacy',
        'symbols',    'grammar'
    ];
    addedWords = [];
    crosswordMap = Array.from(({length: rowLength}), ()=> Array(colLength).fill(""));
    overlapTiles = [];


    const firstWord = availableWordList[availableWordList.length - 6];


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
    const index = availableWordList.indexOf(firstWord);
    console.log(availableWordList);
    if(index !== -1){
        availableWordList.splice(index, 1);
    }


}
function getOverlap(word1Object, word2Object){



    const word1 = word1Object.word;
    const word2 = word2Object.word;

    // the best situtation for overlap is where the intersection happens in the most central
    // part of the word
    console.log(word1Object);
    console.log(word2Object);
    console.log(word1 + " against " + word2);


    let biggestSum = new WordOverLap(word1Object, word2Object, "", 0, !word1Object.isHorizontal);

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

// add word 2 to crossword map
function addToMap(overlapObject) {

    console.log(overlapObject);

    const word1 = Array.from(overlapObject.word1.word);
    const word2 = Array.from(overlapObject.word2.word);

    const overlapCoordinate = [ (overlapObject.word1.row) ,
        (overlapObject.word1.col
            + overlapObject.word1.word.indexOf(overlapObject.letter))];

    overlapTiles.push(overlapCoordinate);

    if(overlapObject.word2.isHorizontal){

    }else{

        const letter = overlapObject.letter;
        const word2Height = word2.length;

        const indexInWord1 = word1.indexOf(letter);
        const indexInWord2 = word2.indexOf(letter);

        const charsAfterOverlap = word2Height - indexInWord2;
        const charsBeforeOverlap = word2Height - charsAfterOverlap;

        console.log("before" + charsBeforeOverlap + " after" + charsAfterOverlap);

        console.log("index1: " + indexInWord1 + " index2: " + indexInWord2);

        // place each letter in the map starting at the first index and then pushing the new word object to the map

        let letterCount = 0;

        const startCol = (overlapObject.word1.col + indexInWord1);
        const startRow = overlapObject.word1.row - charsBeforeOverlap;

        for(let row = startRow;
            row < (overlapObject.word1.row + charsAfterOverlap); row++) {
            console.log("setting address " + row + "," + startCol + "to" +
            word2[letterCount]);
            crosswordMap[row][startCol] = word2[letterCount];
            letterCount++;
        }

        addedWords.push(new Word(overlapObject.word2.word, [startRow, startCol], !overlapObject.word1.isHorizontal));
        console.log(availableWordList)
        overlapTiles.push([])
        const index = availableWordList.indexOf(overlapObject.word2.word);
        if(index !== -1){
            availableWordList.splice(index, 1);
        }

        console.log(" i just removed", word2);
        console.log("words are" + availableWordList);
    }



}

function createCrossword(){

    initalizeMap();

    // after a word is added we check against only current words
    // so it starts against just the starting word

    for(let i = 0; i < addedWords.length; i++){
        const word1 = addedWords[i];
        let largestOverlap = { word1: "", word2: "", letter: "", val: 0, isHorizontal: null};
        for(let j = 0; j < availableWordList.length; j++){
            const word2 = new Word(availableWordList[j], [null, null], !word1.isHorizontal );
            if(word1 !== word2){

                const currentOverlap = getOverlap(word1, word2);
                if(currentOverlap.val > largestOverlap.val){
                    // check if word will fit in array
                    if(isRoomForWord(word1, word2, currentOverlap.letter)){
                        largestOverlap = currentOverlap;

                    }else{

                    }



                }
            }
        }
        console.log("biggest overlap of " + largestOverlap.word1.word + " is " +
            largestOverlap.word2.word  +  " of " + largestOverlap.val + " for " +
            largestOverlap.letter);
        if(largestOverlap.val !== 0){
            console.log("ADDING TO MAP" + largestOverlap.word2.word);
            addToMap(largestOverlap);
        }

    }



}

function isRoomForWord(word1Object, word2Object, letter){

    // we assume that word1 is in the list since its from the list of added words
    console.log("CHECKING IF THERE IS ROOM");
    console.log(overlapTiles);
    const word1 = Array.from(word1Object.word);
    const word2 = Array.from(word2Object.word);
    console.log(word1);
    console.log(word2);


    // borders are 00, 0,25, 25,0 and 25,25
    // if any word would go over that it is invalid, this can just be done
    // mathematically


    if(word1Object.isHorizontal){
        // if first word is horizontal, word2 is cutting through it vertically
        // this means the amount of characters it has before the overlap cant go above 0 height
        // and the characters it has below/after the overlap cant go below max height (25)

        const wordHeight = word2.length;
        const indexOfLetterInWord2 = word2.indexOf(letter);

        if(overlapTiles.includes([word1Object.row,
            (word1Object.col + word1.indexOf(letter))])){
            return false;
        }

        const charsAfterOverlap = wordHeight - indexOfLetterInWord2;
        const charsBeforeOverlap = wordHeight - charsAfterOverlap;

        console.log(charsBeforeOverlap + "= before | letter+after=" + charsAfterOverlap);
        console.log(word1Object.row);
        if(word1Object.row - charsBeforeOverlap < 0){
            return false;
        }
        if(word1Object.row + charsAfterOverlap > rowLength){
            return false;
        }

        const indexOfLetterInWord1 = word1.indexOf(letter);

        let colIndex = word1Object.col + indexOfLetterInWord1

        // navigate backwards/up since word2 is vertical
        // in the word2 and check if spots are empty or not
        // starting one above the intersection
        for(let row = word1Object.row - 1; row >
            (word1Object.row - charsBeforeOverlap - 1);
            row--){
            console.log(crosswordMap[row][colIndex]);
            console.log(row + "," + colIndex );
            if(crosswordMap[row][colIndex]){
                return false;
            }
        }

        for(let row = word1Object.row + 1; row < (word1Object.row + charsAfterOverlap); row++){
            console.log(row + "," + colIndex);
            if(crosswordMap[row][colIndex]){
                return false;
            }
        }



    }else{
        const wordWidth = word2.length;
        const indexOfLetterInWord2 = word2.indexOf(letter);

        if(overlapTiles.includes([word1Object.row,
            (word1Object.col + word1.indexOf(letter))])){
            // if two other words overlap at this point it is impossible for another too
            // return false right away
            return false;
        }

        const charsAfterOverlap = wordWidth - indexOfLetterInWord2;
        const charsBeforeOverlap = wordWidth - charsAfterOverlap;

        console.log(charsBeforeOverlap + "= before | letter+after=" + charsAfterOverlap);
        console.log(word1Object.col);

        if(word1Object.col - charsBeforeOverlap < 0){
            return false;
        }
        if(word1Object.col + charsAfterOverlap > colLength){
            return false;
        }

        const indexOfLetterInWord1 = word1.indexOf(letter);

        let rowIndex = word1Object.row + indexOfLetterInWord1

        // navigate backwards/left since word2 is horizontal
        // in the word2 and check if spots are empty or not
        // starting
        for(let col = word1Object.col - 1; col >
        (word1Object.col - charsBeforeOverlap - 1);
            col--){
            console.log(crosswordMap[rowIndex][col]);
            console.log(rowIndex + "," + col );
            if(crosswordMap[rowIndex][col]){
                return false;
            }
        }

        for(let col = word1Object.col + 1; col < (word1Object.col + charsAfterOverlap); col++){
            console.log(rowIndex + "," + col);
            if(crosswordMap[rowIndex][col]){
                return false;
            }
        }
    }
    console.log("there is room");
    return true;

}

function getCrossword(){
    return crosswordMap;
    }



function resetWordList(){
    availableWordList = [];
}

async function addSynonymsToList(word){
    const result = await callGemini(word);

    const arr = JSON.parse(result);
    // generate synonyms of word, add word itself
    availableWordList.push(word);
    arr.forEach(element => {
        availableWordList.push(element);

    })

    return availableWordList;

}

export {
    createCrossword,
    addSynonymsToList,
    resetWordList,
    getCrossword,
}