
interface TileProps {
    // on Wordle val is color 0/1/2
    // on crossword val is if it has text or not 0/1
    val?: number;
    text?: string;
    styles: CSSModuleClasses,
}

function Tile(props: TileProps) {

    const { val = 0, text = "", styles} = props;

    let color: string = "";

    switch (val) {
        case 0:
            color = "display1";
            break;
        case 1:
            color = "display2";
            break;
        case 2:
            color = "display3";
            break;
    }

    return(
        <div className={`${styles.tile} ${styles[color]}`}>
            {text}
        </div>
    );
}

export default Tile;