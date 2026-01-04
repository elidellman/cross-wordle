import styles from "./CrosswordDisplay.module.css";
import Tile from "../Tile.tsx";


interface CrosswordDisplayProps {
    wordList: string[][];
}

function CrosswordDisplay(props: CrosswordDisplayProps) {

    const {wordList} = props;



    return (

        <>
            <div className={styles.card}>
                {wordList ?

                    wordList.map((val, rowIndex) =>(
                        // each row
                        <div className={styles.row} key={rowIndex}>
                            {val.map((_,colIndex) =>(
                                // each tile
                                <Tile styles={styles} val={
                                    wordList[rowIndex][colIndex] ? 1: 0

                                } text={wordList[rowIndex][colIndex]} key={colIndex}></Tile>
                            ))}
                        </div>
                    )): <h2>LOADING</h2>}
            </div>
        </>
    )


}

export default CrosswordDisplay;