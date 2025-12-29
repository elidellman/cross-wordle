
import './App.css'
import {useEffect, useState} from "react";
import WordleDisplay from "./WordleDisplay/WordleDisplay.tsx";
import * as React from "react";


/*
* Function calls general backend API and sets a new state to hold data
* */
async function callApi(setState: React.Dispatch<React.SetStateAction<object>>, url: string, options?: RequestInit,
                       ) {
    try{
        const response = await fetch(url, options);
        if(!response.ok){
            console.log("HTTP error" + response.statusText);
        }
        const data = await response.json();
        setState(data);
    }catch(e){
        console.error(e);
    }
}


function App() {








    const [message, setMessage] = useState({});
    const [checkResult, setCheckResult] = useState({});


    const [submittedRows, setSubmittedRows] = useState<{color: number, text: string}[][]>([[]]);

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
    const [newLine, setNewLine] = useState(false);



    useEffect(()=>{
        const keyDown = (event: KeyboardEvent) => {
            // santize userInput
            if(event.key === 'Return' || event.key === 'Enter'){
                // call api
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


    useEffect(() => {
        console.log(input);
    }, [input]);




    // when input changes, ie re-render needed


    const displayArray = (()=>{
        // copy input into new row
        const row = Array.from({length: 5}, (_,i)=> ({
            color: 0, text: input[i] || ""
        }));
        if(newLine){
            // if there is a new line, push current row to line ,call api and reset input
            setSubmittedRows((prevState)=>{
                const grid = [...prevState];
                console.log(JSON.stringify(input));



                callApi(setCheckResult, "http://localhost:3000/api/check-wordle", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({answer: input}),

                })

                grid[prevState.length] = row;
                console.log(grid);
                setInput("");




                return grid;

            })
            setNewLine(false);
            return submittedRows;
        }else{
            // update current display with new input
            const grid = [...submittedRows];
            // add new ones
            grid[submittedRows.length] = row;

            return grid;
        }


    })();
    console.log(displayArray);

    useEffect(() => {
        console.log(checkResult);
    }, [checkResult]);



    // this is for testing, eventually get this array from the api




  return (
      <main>

            <h2>This Cant Just Be Another Wordle Clone Can It?</h2>
            <WordleDisplay grid={displayArray}></WordleDisplay>
            <button onClick={() =>
                callApi(setMessage, 'http://localhost:3000/api/get-wordle', undefined)
            }>Get Wordle Word (make on load)</button>

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
