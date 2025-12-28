import styles from './WordleDisplay.module.css'
import Tile from "./Tile.tsx";


interface WordleDisplayProps {
    colorsArray: number[][];
    textArray: string[][];
}


function WordleDisplay(props: WordleDisplayProps) {

    // using a binary array

    const {colorsArray: colorsArray = [[]], textArray = [[]]} = props;





    return(
        // whole display card
        <div className={styles.card}>
            {colorsArray.length > 0 ?

                colorsArray.map((val, rowIndex) =>(
                // each row
                <div className={styles.row} key={rowIndex}>
                    {val.map((valJ,colIndex) =>(
                        // each tile
                        <Tile val={valJ} key ={colIndex} text={textArray[rowIndex][colIndex]}></Tile>
                    ))}
                </div>
            )): null}
        </div>

    );
}

export default WordleDisplay