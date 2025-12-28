
import './App.css'
import {useEffect, useState} from "react";
import WordleDisplay from "./WordleDisplay/WordleDisplay.tsx";
import * as React from "react";


function App() {

    const [message, setMessage] = useState({});
    async function callGetWordleApi(){
        try{
            const response = await fetch('http://localhost:3000/api/get-wordle');
            if(!response.ok){
                throw new Error("HTTP error" + response.statusText);
            }
            const data = await response.json();
            setMessage(data);
        }catch(error){
            console.log(error);
        }
    }

    // if i want the puzzle gen to run when the website starts it should probably not be on a button
    // therefore i can do it here using another useEffect that watches on an empty array to only run once

    // watch message and when the
    // API gets the message back print it ou
    // this will be used to receive the puzzle data securely.

    useEffect(() => {
        // check that it is not empty before using value
        if(Object.keys(message).length !== 0){
            console.log(message);
        }
    }, [message]);

    // everytime user input changes call this code
    // rerender
    const [input, setInput] = useState("");

    useEffect(()=>{
        const keyDown = (event: KeyboardEvent) => {
            // santize userInput

            keyboardUserInput(event, setInput);
            // push

        }
        window.addEventListener("keydown", keyDown);
        return()=>{
            window.removeEventListener("keydown", keyDown);
        }
    }, []);
    console.log(input);




    // this is for testing, eventually get this array from the api
    const wordleArray = [
    []
    ]
    const textArray = [
        []
    ]


  return (
      <main>

            <h2>This Cant Just Be Another Wordle Clone Can It?</h2>
            <WordleDisplay colorsArray={wordleArray} textArray={textArray}></WordleDisplay>
            <button onClick={() => callGetWordleApi()}>Get Wordle Word (make on load)</button>

      </main>
      );
}

function keyboardUserInput(event: KeyboardEvent, setInput: React.Dispatch<React.SetStateAction<string>> ){
// concat current input with new character
    // input must be strictly one char
    if(event.key.length === 1){
        const asciiVal = event.key.charCodeAt(0);
        // check if a-z
        if(asciiVal >= 122 || asciiVal >= 97){
            // word is 5 characters max
            setInput(i => {
                if(i.length < 5){
                    return i + event.key;
                }else{
                    return i;
                }

            });
        }
    }else{
        if(event.key === 'Return'){
            /// handle return here
        }else if(event.key === 'Delete'
            || event.key === 'Backspace'){
            // if delete/backspace remove last character

            setInput(i => i.substring(0,i.length-1));
        }
    }

}

export default App
