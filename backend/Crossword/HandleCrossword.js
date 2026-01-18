import {geminiForSynonyms} from "../Gemini/callGemini.js"
import {geminiForClues} from "../Gemini/callGemini.js"

let cluesDoneLoading = false;


let wordleSynonyms = [];
let availableWordList = [];
let overlapTiles = []



const rowLength = 20;
const colLength = 20;
let crosswordMap = Array.from(({length: rowLength}), ()=> Array(colLength).fill(""));
let addedWords = []


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

function setAvailibleWords(){
    if(wordleSynonyms.length > 0){
        availableWordList = wordleSynonyms;
    }else{
        availableWordList = [
            'hello',      'greeting',
            'salutation', 'welcome',
            'hailing',    'knocking',
            'train',      'locomotive',
            'railroad',   'station',
            'carriage',   'truck',
            'grammar',      'letters',
            'alphabet',   'literacy',
            'symbols',    'abcee'
        ];
    }
}

function initializeMap(){



    //place first word in middle of grid
    overlapTiles = []
    addedWords = []
    crosswordMap = Array.from(({length: rowLength}), ()=> Array(colLength).fill(""));


    // first word will be last word
    const firstWord = availableWordList[availableWordList.length-1];


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
    if(index !== -1){
        availableWordList.splice(index, 1);
    }


}
function getOverlap(word1Object, word2Object){



    const word1 = word1Object.word;
    const word2 = word2Object.word;

    // the best situtation for overlap is where the intersection happens in the most central
    // part of the word


    let biggestSum = new WordOverLap(word1Object, word2Object, "", 0, !word1Object.isHorizontal);

    for(let i = 0; i < word1.length; i++){
        if(word2.includes(word1[i])){
            const commonLetter = word1[i];

            const letterPositionIn1 = i / word1.length;
            const letterPositionIn2 = word2.indexOf(commonLetter) / word1.length;

            const sumPositions = letterPositionIn1 + letterPositionIn2;

            if(isRoomForWord(word1Object, word2Object, commonLetter)){
                if(sumPositions > biggestSum.val){
                    biggestSum.letter = commonLetter;
                    biggestSum.val = sumPositions;
                }
            }



        }
    }
    return biggestSum;
}

// add word 2 to crossword map
function addToMap(overlapObject) {


    const word1 = Array.from(overlapObject.word1.word);
    const word2 = Array.from(overlapObject.word2.word);



    if(overlapObject.word2.isHorizontal){
        const overlapCoordinate = [ (overlapObject.word1.row) ,
            (overlapObject.word1.col
                + overlapObject.word1.word.indexOf(overlapObject.letter))];

        overlapTiles.push(overlapCoordinate);

        const letter = overlapObject.letter;
        const word2Width = word2.length;

        const indexInWord1 = word1.indexOf(letter);
        const indexInWord2 = word2.indexOf(letter);

        const charsAfterOverlap = word2Width - indexInWord2;
        const charsBeforeOverlap = word2Width - charsAfterOverlap;

        // place each letter in the map starting at the first index and then pushing the new word object to the map

        let letterCount = 0;
        const startCol = (overlapObject.word1.col - charsBeforeOverlap);
        const startRow = overlapObject.word1.row + indexInWord1;

        for(let col = startCol;
            col < (overlapObject.word1.col + charsAfterOverlap); col++) {
            crosswordMap[startRow][col] = word2[letterCount];
            letterCount++;
        }



        addedWords.push(new Word(overlapObject.word2.word, [startRow, startCol], !overlapObject.word1.isHorizontal));
        overlapTiles.push([startRow])
        const index = availableWordList.indexOf(overlapObject.word2.word);
        if(index !== -1){
            availableWordList.splice(index, 1);
        }

    }else{
        const overlapCoordinate = [ (overlapObject.word1.row + overlapObject.word1.word.indexOf(overlapObject.letter.letter)) ,
            (overlapObject.word1.col)];

        overlapTiles.push(overlapCoordinate);

        const letter = overlapObject.letter;
        const word2Height = word2.length;

        const indexInWord1 = word1.indexOf(letter);
        const indexInWord2 = word2.indexOf(letter);

        const charsAfterOverlap = word2Height - indexInWord2;
        const charsBeforeOverlap = word2Height - charsAfterOverlap;

        // place each letter in the map starting at the first index and then pushing the new word object to the map

        let letterCount = 0;

        const startCol = (overlapObject.word1.col + indexInWord1);
        const startRow = overlapObject.word1.row - charsBeforeOverlap;
        for(let row = startRow;
            row < (overlapObject.word1.row + charsAfterOverlap); row++) {
            crosswordMap[row][startCol] = word2[letterCount];

            letterCount++;
        }

        addedWords.push(new Word(overlapObject.word2.word, [startRow, startCol], !overlapObject.word1.isHorizontal));
        const index = availableWordList.indexOf(overlapObject.word2.word);
        if(index !== -1){
            availableWordList.splice(index, 1);
        }

    }




}

function createCrossword(){

    setAvailibleWords();
    initializeMap();


    // after a word is added we check against only current words
    // so it starts against just the starting word

    const genWords = async ()=>{
        const startSize = addedWords.length;
        for(let i = 0; i < addedWords.length; i++) {
            const word1 = addedWords[i];
            let largestOverlap = {word1: "", word2: "", letter: "", val: 0, isHorizontal: null};
            for (let j = 0; j < availableWordList.length; j++) {
                const word2 = new Word(availableWordList[j], [null, null], !word1.isHorizontal);
                if (word1 !== word2) {

                    const currentOverlap = getOverlap(word1, word2);

                    if (currentOverlap.val > largestOverlap.val) {
                        // check if word will fit in array
                        largestOverlap = currentOverlap;


                    }
                }
            }
            if (largestOverlap.val !== 0) {
                addToMap(largestOverlap);
            }
        }
        if(startSize < addedWords.length){
            await genWords();
        }else{
            //clear word list to be extra safe
            await createClues();

        }


    }
    genWords().then(() => {
        console.log("Generated words");
    });


}

function isRoomForWord(word1Object, word2Object, letter){

    // we assume that word1 is in the list since its from the list of added words
    const word1 = Array.from(word1Object.word);
    const word2 = Array.from(word2Object.word);

    // borders are 00, 0,25, 25,0 and 25,25
    // if any word would go over that it is invalid, this can just be done
    // mathematically


    if(word1Object.isHorizontal){
        const intersectionPoint = [
            (word1Object.row),
            (word1Object.col + word1.indexOf(letter))
        ]
        // if first word is horizontal, word2 is cutting through it vertically
        // this means the amount of characters it has before the overlap cant go above 0 height
        // and the characters it has below/after the overlap cant go below max height (25)

        const wordHeight = word2.length;
        const indexOfLetterInWord2 = word2.indexOf(letter);

        if(overlapTiles.includes(intersectionPoint)){
            return false;
        }

        const charsAfterOverlap = wordHeight - indexOfLetterInWord2;
        const charsBeforeOverlap = wordHeight - charsAfterOverlap;


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

        if(word1Object.row + 1 < colLength){
            if(crosswordMap[word1Object.row + 1][colIndex]){
                return false;
            }
        }
        if(word1Object.row - 1 > 0){
            if(crosswordMap[word1Object.row - 1][colIndex]){
                return false;
            }
        }

        for(let row = word1Object.row - 1; row >
            (word1Object.row - charsBeforeOverlap - 1);
            row--){


            if(crosswordMap[row][colIndex]){
                return false;
            }
            if(row-1 >= 0){
                if(crosswordMap[row - 1][colIndex]){
                    return false;
                }
                //other side of overlap
                if(row-2 >= 0){
                    if(crosswordMap[row - 1][colIndex]){
                        return false;
                    }
                }
            }

            if(colIndex-1 >= 0){
                if(crosswordMap[row][colIndex-1]){
                    return false;
                }
            }
            if(colIndex+1 < colLength){
                if(crosswordMap[row][colIndex+1]){
                    return false;
                }
            }

        }

        for(let row = word1Object.row + 1; row < (word1Object.row + charsAfterOverlap); row++){
            if(crosswordMap[row][colIndex]){
                return false;
            }
            if(row+1 < colLength){
                if(crosswordMap[row + 1][colIndex]){
                    return false;
                }
                if(row+2 < colLength){
                    if(crosswordMap[row + 2][colIndex]){
                        return false;
                    }
                }
            }
            if(colIndex-1 >= 0){
                if(crosswordMap[row][colIndex-1]){
                    return false;
                }
            }
            if(colIndex+1 < colLength){
                if(crosswordMap[row][colIndex+1]){
                    return false;
                }
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


        // if overflow to the left
        if(word1Object.col - charsBeforeOverlap < 0){
            return false;
        }
        // if overflow to the right
        if(word1Object.col + charsAfterOverlap > colLength){
            return false;
        }

        // if there is a character 1 before the start


        const indexOfLetterInWord1 = word1.indexOf(letter);

        let rowIndex = word1Object.row + indexOfLetterInWord1

        // navigate backwards/left since word2 is horizontal
        // in the word2 and check if spots are empty or not
        // starting

        if(word1Object.col + 1 < colLength){
            if(crosswordMap[rowIndex][word1Object.col + 1]){
                return false;
            }
        }
        if(word1Object.col - 1 > 0){
            if(crosswordMap[rowIndex][word1Object.col - 1]){
                return false;
            }
        }

        for(let col = word1Object.col - 1; col >
        (word1Object.col - charsBeforeOverlap - 1);
            col--){

            if(crosswordMap[rowIndex][col]){
                return false;
            }

            if(col-1 >= 0){
                if(crosswordMap[rowIndex][col-1]){
                    return false;
                }
                if(col-2 >= 0){
                    if(crosswordMap[rowIndex][col-2]){
                        return false;
                    }
                }
            }

            if(rowIndex-1 >= 0){
                if(crosswordMap[rowIndex-1][col]){
                    return false;
                }
            }
            if(rowIndex+1 < colLength){
                if(crosswordMap[rowIndex+1][col]){
                    return false;
                }
            }
        }

        for(let col = word1Object.col + 1; col < (word1Object.col + charsAfterOverlap); col++){
            if(crosswordMap[rowIndex][col]){
                return false;
            }

            if(col+1 < colLength){
                if(crosswordMap[rowIndex][col+1]){
                    return false;
                }
                if(col+2 < colLength){
                    if(crosswordMap[rowIndex][col+2]){
                        return false;
                    }
                }
            }

            if(rowIndex-1 >= 0){
                if(crosswordMap[rowIndex-1][col]){
                    return false;
                }
            }
            if(rowIndex+1 < colLength){
                if(crosswordMap[rowIndex+1][col]){
                    return false;
                }
            }
        }
    }
    return true;

}

function getCrossword() {
    // take crossword and fill each letter with a space
    for(let i = 0; i < crosswordMap.length; i++){
        for(let j = 0; j < crosswordMap[i].length; j++){
            if(crosswordMap[i][j]){
                crosswordMap[i][j] = " ";
            }
        }
    }
    return crosswordMap;

}

function compareCrossword(crossword){
    if(crosswordMap.length !== crossword.length){
        return false;
    }
    for(let i = 0; i < crosswordMap.length; i++){
        for(let j = 0; j < crosswordMap[i].length; j++){
            if(crosswordMap[i][j] !== crossword[i][j]){
                return false;
            }
        }
    }
    return true;

}

function resetWordList(){

    availableWordList = []
    overlapTiles = []
    addedWords = []
    wordleSynonyms = []
    crosswordMap = Array.from(({length: rowLength}), ()=> Array(colLength).fill(""));



}

async function addSynonymsToList(word){
    const result = await geminiForSynonyms(word);
    const arr = JSON.parse(result);
    // generate synonyms of word, add word itself
    arr.forEach(element => {
        wordleSynonyms.push(element);

    })
    wordleSynonyms.push(word);

    return availableWordList;

}

///CLUESf

const clueMap = new Map();

async function createClues(){
    console.log(addedWords);
    const length = addedWords.length;

    for(let i = 0; i <length; i++){
        const result = await geminiForClues(addedWords[i]);
        console.log(result);
        clueMap.set(JSON.stringify([addedWords[i].row, addedWords[i].col]), result);
    }
    cluesDoneLoading = true;

}

function getClue(cords){

    if(cluesDoneLoading){
        return clueMap.get(JSON.stringify(cords)) ||
             "Click On A Tile To Get A Clue";
    }else{
        return clueMap.get(JSON.stringify(cords)) ||
            "Clues Are Loading";
    }



}





export {
    createCrossword,
    getClue,
    createClues,
    addSynonymsToList,
    resetWordList,
    setAvailibleWords,
    getCrossword,
    compareCrossword,
}