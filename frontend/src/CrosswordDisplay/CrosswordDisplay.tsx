import styles from "./CrosswordDisplay.module.css";
import Tile from "../Tile.tsx";
import InputBox from "./InputBox.tsx";
import CrosswordTile from "./crosswordTile.tsx";




interface CrosswordDisplayProps {
    wordList: string[][];
}

function CrosswordDisplay(props: CrosswordDisplayProps) {

    const {wordList} = props;
    let focusedTile = null;




    return (

        <>
            <div className={styles.card}>
                {wordList ?

                    wordList.map((val, rowIndex) =>(
                        // each row
                        <div className={styles.row} key={rowIndex}>
                            {val.map((_,colIndex) =>(
                                // each tile
                                    <CrosswordTile styles={styles} val={
                                        wordList[rowIndex][colIndex] ? "display1" : "display0"

                                    } text={wordList[rowIndex][colIndex]} key={colIndex}

                                    ></CrosswordTile>
                            ))}
                        </div>
                    )): <h2>LOADING</h2>}
            </div>
        </>
    )


}

export default CrosswordDisplay;