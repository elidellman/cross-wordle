import styles from "./CrosswordDisplay.module.css";
import Tile from "../Tile.tsx";
import InputBox from "./InputBox.tsx";
import CrosswordTile from "./crosswordTile.tsx";
import {useEffect, useState} from "react";
import * as React from "react";
import crosswordTile from "./crosswordTile.tsx";




interface CrosswordDisplayProps {
    wordMap: string[][];
}

function CrosswordDisplay(props: CrosswordDisplayProps) {



    const {wordMap} = props;
    const [focused, setFocused] = React.useState<{row: number, col: number, isHorizontal: boolean}>();
    const [focusedLenghth, setFocusedLenghth] = React.useState<number>(0);
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
                setFocusedLenghth(curTile[1])
            }else if(wordMap[curTile[0]][curTile[1] - 1] === ''){
                console.log("start of row is" + curTile);
                setFocusedLenghth(curTile[1])

            }
            console.log(curTile);
            curTile[1]--;
        }
    }

    const findStartOfCol = (startTile: [number, number])=>{
        const curTile: [number, number] = startTile;
        while(wordMap[curTile[0]][curTile[1]]){

            if(curTile[0] - 1 < 0){
                // if end of row is found collides with wall
                console.log("start of col is" + curTile);
                setFocusedLenghth(curTile[0])
                break;
            }else if(wordMap[curTile[0]-1][curTile[1]] === ''){
                console.log("start of col is" + curTile);
                setFocusedLenghth(curTile[0])
                break;

            }else{
                curTile[0]--;
            }
            console.log(curTile +" being decremented");
        }
    }


    // when focused tile changes
    useEffect(() => {
        console.log("clicked");
        if(focused){
            /*if(focused.isHorizontal){
                findStartOfRow([focused.row, focused.col]);
            }else{
                findStartOfCol([focused.row, focused.col]);
            }*/

        }
    }, [focused]);


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