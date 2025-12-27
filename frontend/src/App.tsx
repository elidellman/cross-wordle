
import './App.css'
import {useEffect, useState} from "react";
import WordleDisplay from "./WordleDisplay/WordleDisplay.tsx";



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

    // this is for testing, eventually get this array from the api
    const wordleArray = [
        [0,0,1,1,2],
        [1,1,0,0,2],
        [0,1,0,1,2],
        [0,1,0,1,2],
        [0,0,0,0,2],
    ]


  return (
      <main>
            <h2>This Cant Just Be Another Wordle Clone Can It?</h2>
            <WordleDisplay displayArray={wordleArray}></WordleDisplay>
            <button onClick={() => callGetWordleApi()}>Get Wordle Word (make on load)</button>

      </main>
      );
}

export default App
