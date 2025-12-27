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

module.exports = getWordle;

// export function to be used by index.js