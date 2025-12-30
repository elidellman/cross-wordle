const fs = require('fs');

function loadFile(filename) {

    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if(err){
                reject(err);
            }
            const text = data.trim().split('\n');
            resolve(text);


        });
    })
}

async function getWordle(){

    const wordList = await loadFile('./wordle/valid-wordle-words.txt');
    let randomNum = (Math.round(Math.random() * (wordList.length)));

    return {
        text: wordList[randomNum],
    };

}

async function isValidWordle(word){
    const wordList = await loadFile('./wordle/valid-wordle-words.txt');
    for(let entry of wordList){

        console.log(entry);
        if(entry === word){
            return true;
        }
    }
    return false;

}



module.exports = {
    getWordle: getWordle,
    isValidWordle,
}
// export function to be used by index.js