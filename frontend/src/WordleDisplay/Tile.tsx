import styles from './WordleDisplay.module.css'


interface TileProps {
    val?: number;
}

function Tile(props: TileProps) {

    const { val = 0 } = props;

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

        </div>
    );
}

export default Tile;