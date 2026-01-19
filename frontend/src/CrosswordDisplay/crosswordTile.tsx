import {useEffect, useState} from "react";
import * as React from "react";

interface TileProps {
    // on Wordle val is color 0/1/2
    // on crossword val is if it has text or not 0/1
    val?: string;
    text?: string;
    styles: CSSModuleClasses,
    coordinate: [number, number],
    clickAction: (coordinate: [number, number]) => void,
}


function CrosswordTile(props: TileProps) {

    const { val = "", text = "", styles, clickAction, coordinate} = props;

    const [displayType, setDisplayType] = useState("");
    const coord = coordinate;

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        console.log(event.currentTarget);
        clickAction(coord)
    }

    useEffect(() => {
        setDisplayType(val);
    }, [val]);

    return(
        <div className={`${styles.tile} ${styles[displayType]}`}
        onClick={handleClick}
        >
            {text}
        </div>
    );
}

export default CrosswordTile;