import styles from './WordleDisplay.module.css'


interface TileProps {
    // color value, refactor name before prod
    val?: number;
    text?: string;
}

function Tile(props: TileProps) {

    const { val = 0, text = ""} = props;

    let color: string = "";

    switch (val) {
        case 0:
            color = "grey";
            break;
        case 1:
            color = "yellow";
            break;
        case 2:
            color = "green";
            break;
    }

    return(
        <div className={`${styles.tile} ${styles[color]}`}>
            {text}
        </div>
    );
}

export default Tile;