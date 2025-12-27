import styles from './WordleDisplay.module.css'
import Tile from "./Tile.tsx";


interface WordleDisplayProps {
    displayArray: number[][];
}


function WordleDisplay(props: WordleDisplayProps) {

    // using a binary array

    const {displayArray = [[]]} = props;





    return(
        // whole display card
        <div className={styles.card}>
            {displayArray.map((val, rowIndex) =>(
                // each row
                <div className={styles.row} key={rowIndex}>
                    {val.map((valJ,colIndex) =>(
                        // each tile
                        <Tile val={valJ} key ={colIndex}></Tile>
                    ))}
                </div>
            ))}
        </div>

    );
}

export default WordleDisplay