import styles from "./CrosswordDisplay.module.css";
import Tile from "../Tile.tsx";
import InputBox from "./InputBox.tsx";
import CrosswordTile from "./crosswordTile.tsx";
import {useEffect, useEffectEvent, useState} from "react";
import * as React from "react";
import crosswordTile from "./crosswordTile.tsx";



interface CrosswordDisplayProps {
    wordMap: string[][];
}

function CrosswordDisplay(props: CrosswordDisplayProps) {

    const keyboardUserInput = (event: KeyboardEvent, setInput: React.Dispatch<React.SetStateAction<string>> ) =>{
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
                // if delete/backspace remove last character

                setInput(i => i.substring(0,i.length-1));
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
    const [focusedStart, setFocusedStart] = React.useState<[number,number]>();
    const focusedStartRef = React.useRef<[number,number]>([-1,-1]);
    const focusedLengthRef = React.useRef(0);
    const inputRef = React.useRef("");
    const [input, setInput] = useState("");


    useEffect(() => {
        console.log("length" + focusedLength);
        focusedLengthRef.current = focusedLength;
        console.log(focusedLengthRef.current);
    }, [focusedLength]);


    const handleClick = (coordinate: [number, number]) =>{
        console.log(coordinate);
        if(focused){
            if(focused.row == coordinate[0] || focused?.col == coordinate[1]){
                setFocused((state)=>{return {row: coordinate[0], col: coordinate[1], isHorizontal: false }});
            }
        }
        setFocused((state)=>{return {row: coordinate[0], col: coordinate[1], isHorizontal: true }});


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
        console.log("input is" + input);
        // set input to map
        let inputCount = 0;
        if(focused){
            if(focused.isHorizontal){
                let newRow = []
                for(let i = 0; i < 20; i++){
                    if(inputCount < focusedLengthRef.current && i >= focusedStartRef.current[1]){
                        newRow.push(input[inputCount]);
                        inputCount++;
                    }else{
                        newRow.push(displayMap[focusedStartRef.current[0]][i]);
                    }
                }
                console.log(newRow);
                setDisplayMap((prevState) =>
                    prevState.map((row,r)=>{
                        if(r === focusedStartRef.current[0]){
                            return newRow;
                        }else{
                            return row;
                        }
                    })

                );

            }
            if(!focused.isHorizontal){
                let newCol = [];
                for(let i = 0; i < 20; i++){
                    if(inputCount < focusedLengthRef.current && i >= focusedStartRef.current[0]){
                        newCol.push(input[inputCount]);
                        inputCount++;
                    }else{
                        newCol.push(displayMap[focusedStartRef.current[0]][i]);
                    }
                }
                console.log(newCol);
                setDisplayMap(prevState =>
                    prevState.map((row, r) => {
                        // only rows that belong to the word
                        if (
                            r >= focusedStartRef.current![0] &&
                            r < focusedStartRef.current![0] + focusedLengthRef.current
                        ) {
                            const newRow = [...row];
                            const col = focusedStartRef.current![1];
                            const letterIndex = r - focusedStartRef.current![0];

                            newRow[col] = input[letterIndex] ?? row[col];
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
        console.log(startTile);
        // this is simpler since we only read left-right and up-down
        const curTile: [number, number] = startTile;
        let firstTile: [number, number];

        while(wordMap[curTile[0]][curTile[1]]){

            if((curTile[1] - 1 < 0 )|| (wordMap[curTile[0]][curTile[1] - 1] === '')){
                // if end of row is found collides with wall
                console.log("start of row is" + curTile);

                firstTile = JSON.parse(JSON.stringify(curTile));
                while(curTile[1] + 1 < 20){
                    console.log("cur" + curTile);
                    if(wordMap[curTile[0]][curTile[1] + 1] === ''){
                        console.log("found white at" + curTile);

                        break;
                    }
                    curTile[1]++;
                }
                setFocusedLength(curTile[1] - firstTile[1] + 1);
                setFocusedStart(firstTile);
                break;
            }else{
                curTile[1]--;
            }
            console.log(curTile);
        }
    }

    const findStartOfCol = async (startTile: [number, number])=>{
        const curTile: [number, number] = startTile;
        let firstTile: [number, number];

        while(wordMap[curTile[0]][curTile[1]]){

            if((curTile[0] - 1 < 0) || (wordMap[curTile[0]-1][curTile[1]] === '')){
                // if end of row is found collides with wall
                console.log("start of col is" + curTile);
                // need to wrap back untill we find another white tile to find length
                firstTile = JSON.parse(JSON.stringify(curTile));
                while(curTile[0] + 1 < 20){
                    console.log("cur" + curTile);
                    if(wordMap[curTile[0] + 1][curTile[1]] === ''){
                        console.log("start of col is" + curTile);
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
            console.log(curTile +" being decremented");
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
        console.log("clicked");
        if(focused !== undefined){
            focusOnLine(focused);
            setInput("");
            // put into into row


        }
    }, [focused]);

    useEffect(() => {
        focusedStartRef.current = focusedStart;
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
        console.log(input);
        inputRef.current = input;
        handleInputChange();
    }, [input]);



    return (

        <>
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