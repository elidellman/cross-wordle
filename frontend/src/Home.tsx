
import {useEffect, useState} from "react";
import WordleDisplay from "./WordleDisplay/WordleDisplay.tsx";
import * as React from "react";
import { useNavigate} from "react-router-dom";
import list from "./List.tsx";


async function callApi(
    url: string,
    options?: RequestInit
){
    try{
        const response = await fetch(url, options);
        if(!response.ok){
            console.log("HTTP error" + response.statusText);
        }
        const data = await response.json();
        return data;
    }catch(e){
        console.error(e);
    }
    return null;
}


function Home() {



    const submitRow = async () =>{
        const result = await callApi("http://localhost:3000/api/check-wordle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({answer: input}),

        });
        for(let i = 0; i < 5; i++){
            if(result[i] != 2){
                break;
            }
            if(i == 4){
                setWordleComplete(true);
            }
        }


        if(JSON.stringify(result) == JSON.stringify([2,2,2,2,2])){

        }


        const row = Array.from({ length: 5 }, (_, i) => ({
            color: result[i],
            text: input[i] || "",
        }));

        // if there is a new line, push current row to line ,call api and reset input
        setSubmittedRows((prevState)=>{
            const grid = [...prevState];
            grid[prevState.length] = row;
            return grid;

        })
        setNewLine(false);
        setInput("");
        return submittedRows;
    }






    const [message, setMessage] = useState({});
    const [checkResult, setCheckResult] = useState<{answer: number}[]>([])
    const [wordleComplete, setWordleComplete] = useState(false);

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


    useEffect(() => {
        if(newLine){
            submitRow();
        }
    }, [newLine]);


    // when input changes, ie re-render needed


    const displayArray = (()=>{
        // copy input into new row

        // update current display with new input
        const grid = [...submittedRows];
        // add new ones
        const row = Array.from({length: 5}, (_,i)=> ({
            color: 0, text: input[i] || ""
        }));
        grid[submittedRows.length] = row;

        return grid;
    })();
    console.log(displayArray);

    useEffect(() => {
        console.log(checkResult);

    }, [checkResult]);

    const navigate = useNavigate();

    useEffect(() => {
        if(wordleComplete){
            navigate("/crossword", {replace: false});
            setWordleComplete(false);
        }
    }, [wordleComplete, navigate]);

    return(

        <>
            <main>

                <h2>This Cant Just Be Another Wordle Clone Can It?</h2>
                <WordleDisplay grid={displayArray}></WordleDisplay>
                <button onClick={() =>
                    callApi('http://localhost:3000/api/get-wordle', undefined)
                }>Get Wordle Word (make on load)
                </button>

            </main>
        </>

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

export default Home;