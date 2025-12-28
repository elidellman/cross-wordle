
import './App.css'
import {useEffect, useState} from "react";
import WordleDisplay from "./WordleDisplay/WordleDisplay.tsx";
import * as React from "react";


function App() {

    const [message, setMessage] = useState({});
    const [textArray, setTextArray] = useState<string[][]>([[]]);
    const [colorsArray, setColorsArray] = useState<number[][]>([[]]);
    const [newLine, setNewLine] = useState(false);

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
            if(event.key === 'Return' || event.key === 'Enter'){
                setNewLine(true);

            }else{
                keyboardUserInput(event, setInput);
            }

        }
        window.addEventListener("keydown", keyDown);
        return()=>{
            window.removeEventListener("keydown", keyDown);
        }
    }, []);



    // when input changes, ie re-render needed
    useEffect(() => {
            if(newLine){

                if(input.length === 5){
                    setTextArray(prevArray =>{
                        const newGrid = [...prevArray];
                        newGrid[prevArray.length] = Array(5).fill("");
                        return newGrid;
                    });
                    setColorsArray(prevArray => {
                        const newGrid = [...prevArray];
                        newGrid[prevArray.length] =
                            Array(5).fill(0);
                        return newGrid;

                    });
                    setInput("");
                }

                setNewLine(false);

            }else{
                setTextArray(prevArray => {
                    const newGrid = [...prevArray];
                    newGrid[prevArray.length-1] = Array(5).fill("").map((x, index)=>
                            input[index] ? input[index] : x

                    );

                    return newGrid;
                });
                setColorsArray(prevArray => {
                    // right here i should call api
                    const newGrid = [...prevArray];
                    newGrid[prevArray.length-1] = Array(5).fill(0).map((x, index)=>
                        input[index] ? input[index] : x

                    );
                    return newGrid;
                });
            }

    }, [newLine, input]);

    console.log(colorsArray);




    // this is for testing, eventually get this array from the api




  return (
      <main>

            <h2>This Cant Just Be Another Wordle Clone Can It?</h2>
            <WordleDisplay colorsArray={colorsArray} textArray={textArray}></WordleDisplay>
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
        if(event.key === 'Delete'
            || event.key === 'Backspace'){
            // if delete/backspace remove last character

            setInput(i => i.substring(0,i.length-1));
        }
    }

}

export default App
