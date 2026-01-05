import {useEffect, useState} from "react";

interface TileProps {
    // on wordle val is color 0/1/2
    // on crossword val is if it has text or not 0/1
    val?: string;
    text?: string;
    styles: CSSModuleClasses,
}


function CrosswordTile(props: TileProps) {

    const { val = "", text = "", styles} = props;

    const [displayType, setDisplayType] = useState(val);



    const handleClick = (event: React.MouseEvent<HTMLDivElement>) =>{
        console.log(event.currentTarget);
        setDisplayType("display3");
    }



    return(
        <div className={`${styles.tile} ${styles[displayType]}`}
        onClick={handleClick}>
            {text}
        </div>
    );
}

export default CrosswordTile;