import styles from "./CrosswordDisplay.module.css";
import Tile from "../Tile.tsx";
import InputBox from "./InputBox.tsx";
import CrosswordTile from "./crosswordTile.tsx";
import {use, useEffect, useEffectEvent, useState} from "react";
import * as React from "react";
import crosswordTile from "./crosswordTile.tsx";
import ClueBox from "./ClueBox.tsx";



interface CrosswordDisplayProps {
    wordMap: string[][];
}

function CrosswordDisplay(props: CrosswordDisplayProps) {

    const keyboardUserInput = (event: KeyboardEvent,  f: React.Dispatch<React.SetStateAction<string>> ) =>{
// concat current input with new character
        // input must be strictly one char
        if(event.key.length === 1){
            const asciiVal = event.key.charCodeAt(0);
            // check if a-z
            if(asciiVal >= 122 || asciiVal >= 97){
                // word is 5 characters max
                setInput(i => {
                    console.log(focusedLengthRef.current)
                    if(i.length < focusedLengthRef.current){
                        return i + event.key;
                    }else{
                        return i;
                    }

                });
            }
        }else{
            if(event.key === 'Delete'
                || event.key === 'Backspace'){
                event.preventDefault();
                // if delete/backspace remove last character

                setInput(i => {
                        const len = i.split("-")[0].length;
                        const newRow = i.split("");
                        newRow[len-1] = "-";
                        return newRow.join("");
                    }
                );
            }
        }

    }


    const {wordMap} = props;
    const [displayMap, setDisplayMap] = useState<string[][]>([]);

    useEffect(() => {
        setDisplayMap(props.wordMap.map(row=>[...row]));
    }, [props.wordMap]);

    const [focused, setFocused] = React.useState<{row: number, col: number, isHorizontal: boolean}>();
    const [focusedLength, setFocusedLength] = React.useState<number>(0);

    const [lastFocusedStart, setlastFocusedStart] = React.useState<[number,number]>([-1,-1]);
    const lastFocusedStartRef = React.useRef<[number,number]>([-1,-1]);

    const [focusedStart, setFocusedStart] = React.useState<[number,number]>([-1,-1]);
    const focusedStartRef = React.useRef<[number,number]>([-1,-1]);
    const focusedLengthRef = React.useRef(0);
    const inputRef = React.useRef("");
    const [input, setInput] = useState("");


    useEffect(() => {
        focusedLengthRef.current = focusedLength;
    }, [focusedLength]);


    const handleClick = (coordinate: [number, number]) =>{
        console.log(coordinate);
        if(focused){
            if(focused.row == coordinate[0] && focused.col == coordinate[1]){
                // double clicked
                setFocused((state)=>{return {row: coordinate[0], col: coordinate[1], isHorizontal: !state?.isHorizontal }});
            }else{
                setFocused((state)=>{return {row: coordinate[0], col: coordinate[1], isHorizontal: true }});

            }
        }else{
            setFocused((state)=>{return {row: coordinate[0], col: coordinate[1], isHorizontal: true }});

        }


    }

    const handleFocusedTile = (rowIndex: number, colIndex: number)=>{
        if(focused){
            if(focused.row == rowIndex && focused.col == colIndex){
                return "display3";
            }
        }
        return wordMap[rowIndex][colIndex] ? "display1" : "display0";
    }

    const handleInputChange = () => {
        let curWord = input;

        // set input to map
        // if map alraedy has something where focus is set that to input
        let inputCount = 0;
        if(focused){
            if(focused.isHorizontal){

                setDisplayMap((prevState) =>


                    prevState.map((row,r)=>{
                        const newRow = row;
                        if(r === focused.row){
                            for(let i = 0; i < 20; i++) {
                                // if the index is past or at the start of the focus, say 0,0
                                // and the index is before the start of the index + the length so 0,0 + 5 means it
                                // must be before 0,5 to be a valid input char




                                if(i >= focusedStartRef.current[1] &&
                                i < focusedLengthRef.current + focusedStartRef.current[1] ){
                                    // put in input char
                                    if(input[inputCount] === "-"){
                                        setInput(prev=>prev.replace("-",""));
                                        newRow[i]="";
                                        inputCount++;

                                    }else{
                                        newRow[i] = input[inputCount] || displayMap[r][i] || "";
                                        inputCount++;
                                    }

                                }else{
                                    // put in char that was already there otherwise
                                    newRow[i] = displayMap[r][i] || "";
                                }

                            }

                        }
                        inputCount = 0;
                        return newRow;
                    })

                );

            }
            else if(!focused.isHorizontal){
                let newCol = [];

                for(let i = 0; i < 20; i++){
                    if(inputCount < focusedLengthRef.current && i >= focusedStartRef.current[0]){
                        newCol.push(input[inputCount]);
                        inputCount++;
                    }else{
                        newCol.push(displayMap[focusedStartRef.current[0]][i]);
                    }
                }
                setDisplayMap(prevState =>
                    prevState.map((row, r) => {
                        // only rows that belong to the word
                        if (r >= focusedStartRef.current[0] &&
                            r < focusedStartRef.current[0] + focusedLengthRef.current)
                        {
                            const newRow = [...row];
                            const col = focusedStartRef.current[1];
                            const letterIndex = r - focusedStartRef.current[0];

                            if (input[letterIndex] === "-") {
                                setInput(prev => prev.slice(0, letterIndex) + prev.slice(letterIndex + 1));
                                newRow[col] = "";
                            } else {
                                newRow[col] = input[letterIndex] ?? row[col];
                            }

                            return newRow;
                        }

                        return row;
                    })
                );

            }
        }

    }

    useEffect(() => {
        console.log(displayMap);
    }, [displayMap]);

    const findStartOfRow = (startTile: [number, number])=>{
        // this is simpler since we only read left-right and up-down
        const curTile: [number, number] = startTile;
        let firstTile: [number, number];

        while(wordMap[curTile[0]][curTile[1]]){
            if((curTile[1] - 1 < 0 )|| (wordMap[curTile[0]][curTile[1] - 1] === '')){
                // if end of row is found collides with wall
                firstTile = JSON.parse(JSON.stringify(curTile));
                let curInput = displayMap[firstTile[0]][firstTile[1]];
                while(curTile[1] + 1 < 20){

                    if(wordMap[curTile[0]][curTile[1] + 1] === ''){

                        break;
                    }
                    curTile[1]++;
                    /*if(displayMap[curTile[0]][curTile[1]] != undefined){
                        curInput += displayMap[curTile[0]][curTile[1]];
                    }*/
                }
                setFocusedLength(curTile[1] - firstTile[1] + 1);
                setFocusedStart(firstTile);
                break;
            }else{
                curTile[1]--;
            }

        }
    }

    const findStartOfCol = async (startTile: [number, number])=>{
        const curTile: [number, number] = startTile;
        let firstTile: [number, number];

        while(wordMap[curTile[0]][curTile[1]]){

            if((curTile[0] - 1 < 0) || (wordMap[curTile[0]-1][curTile[1]] === '')){
                // if end of row is found collides with wall
                // need to wrap back untill we find another white tile to find length
                firstTile = JSON.parse(JSON.stringify(curTile));
                while(curTile[0] + 1 < 20){
                    if(wordMap[curTile[0] + 1][curTile[1]] === ''){
                        break;
                    }
                    curTile[0]++;
                }

                setFocusedLength(curTile[0] - firstTile[0] + 1);
                setFocusedStart(firstTile);

                break;
            }else{
                curTile[0]--;
            }
        }
    }

    const focusOnLine = useEffectEvent( (focus: {row: number, col: number, isHorizontal: boolean} ) =>{
        if(focus.isHorizontal){
            findStartOfRow([focus.row, focus.col]);
        }else{
            findStartOfCol([focus.row, focus.col]);
        }
    })
    // when focused tile changes
    useEffect(() => {
        if(focused !== undefined){


            if(lastFocusedStartRef.current == focusedStartRef.current){
            }
            focusOnLine(focused);

            // put into into row


        }
    }, [focused]);


    useEffect(() => {
        lastFocusedStartRef.current = focusedStartRef.current;
        focusedStartRef.current = focusedStart;
        if(lastFocusedStartRef.current !== focusedStartRef.current){
            setInput("");
        }
    }, [focusedStart]);


    useEffect(()=>{
        const keyDown = (event: KeyboardEvent) => {
            // santize userInput
            if(event.key === 'Return' || event.key === 'Enter'){
                // call api
                //setNewLine(true);

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
        inputRef.current = input;
        handleInputChange();
    }, [input]);



    return (

        <>
            <ClueBox wordCords={focusedStart? focusedStart: [-1,-1]}></ClueBox>
            <div className={styles.card}>
                {displayMap ?

                    displayMap.map((val, rowIndex) =>(
                        // each row
                        <div className={styles.row} key={rowIndex}>
                            {val.map((_,colIndex) =>(
                                // each tile
                                    <CrosswordTile styles={styles} val={handleFocusedTile(rowIndex, colIndex)}
                                    coordinate={[rowIndex, colIndex]}
                                    clickAction={handleClick}
                                    text={displayMap[rowIndex][colIndex]} key={`${rowIndex}-${colIndex}`}

                                    ></CrosswordTile>

                            ))}
                        </div>
                    )): <h2>LOADING</h2>}

            </div>
        </>
    )


}

export default CrosswordDisplay;