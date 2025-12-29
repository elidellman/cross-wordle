import styles from './WordleDisplay.module.css'
import Tile from "./Tile.tsx";


interface WordleDisplayProps {
    grid: { color: number, text: string }[][];
}


function WordleDisplay(props: WordleDisplayProps) {

    // using a binary array

    const {grid} = props;





    return(
        // whole display card
        <div className={styles.card}>
            {grid.length > 0 ?

                grid.map((val, rowIndex) =>(
                // each row
                <div className={styles.row} key={rowIndex}>
                    {val.map((_,colIndex) =>(
                        // each tile
                        <Tile val={grid[rowIndex][colIndex].color} key ={colIndex} text={grid[rowIndex][colIndex].text}></Tile>
                    ))}
                </div>
            )): null}
        </div>

    );
}

export default WordleDisplay