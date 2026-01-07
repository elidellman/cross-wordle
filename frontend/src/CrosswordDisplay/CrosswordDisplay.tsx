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
        console.log(event.key)
        if(event.key.length === 1){
            const asciiVal = event.key.charCodeAt(0);
            // check if a-z
            if(asciiVal >= 122 || asciiVal >= 97){
                // word is 5 characters max
                setInput(i => {
                    console.log(focusedLength);
                    if(i.length < focusedLength){
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
    const [focused, setFocused] = React.useState<{row: number, col: number, isHorizontal: boolean}>();
    const [focusedLength, setFocusedLength] = React.useState<number>(0);
    const [input, setInput] = useState("");





    const handleClick = (coordinate: [number, number]) =>{
        console.log(coordinate);
        setFocused((state)=>{return {row: coordinate[0], col: coordinate[1], isHorizontal: (state ? !state.isHorizontal: true) }});
        //setFocused(event.currentTarget.co)\

    }

    const handleFocusedTile = (rowIndex: number, colIndex: number)=>{
        if(focused){
            if(focused.row == rowIndex && focused.col == colIndex){
                return "display3";
            }
        }
        return wordMap[rowIndex][colIndex] ? "display1" : "display0";
    }

    const findStartOfRow = (startTile: [number, number])=>{
        console.log(startTile);
        // this is simpler since we only read left-right and up-down
        const curTile: [number, number] = startTile;

        while(wordMap[curTile[0]][curTile[1]]){

            if(curTile[1] - 1 < 0){
                // if end of row is found collides with wall
                console.log("start of row is" + curTile);
                setFocusedLength(curTile[1])
            }else if(wordMap[curTile[0]][curTile[1] - 1] === ''){
                console.log("start of row is" + curTile);
                setFocusedLength(curTile[1])

            }
            console.log(curTile);
            curTile[1]--;
        }
    }

    const findStartOfCol = async (startTile: [number, number])=>{
        const curTile: [number, number] = startTile;
        while(wordMap[curTile[0]][curTile[1]]){

            if(curTile[0] - 1 < 0){
                // if end of row is found collides with wall
                console.log("start of col is" + curTile);
                setFocusedLength(curTile[0])
                break;
            }else if(wordMap[curTile[0]-1][curTile[1]] === ''){
                console.log("start of col is" + curTile);
                setFocusedLength(curTile[0])
                break;

            }else{
                curTile[0]--;
            }
            console.log(curTile +" being decremented");
        }
    }

    const focusOnRow = useEffectEvent( (focus: {row: number, col: number, isHorizontal: boolean} ) =>{
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
            focusOnRow(focused);
        }
    }, [focused]);

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
    }, [input]);


    return (

        <>
            <div className={styles.card}>
                {wordMap ?

                    wordMap.map((val, rowIndex) =>(
                        // each row
                        <div className={styles.row} key={rowIndex}>
                            {val.map((_,colIndex) =>(
                                // each tile
                                    <CrosswordTile styles={styles} val={handleFocusedTile(rowIndex, colIndex)}
                                    coordinate={[rowIndex, colIndex]}
                                    clickAction={handleClick}
                                    text={wordMap[rowIndex][colIndex]} key={`${rowIndex}-${colIndex}`}

                                    ></CrosswordTile>
                            ))}
                        </div>
                    )): <h2>LOADING</h2>}
            </div>
        </>
    )


}

export default CrosswordDisplay;