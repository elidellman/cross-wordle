import {Link, useLocation} from "react-router-dom";
import {callApi} from "./CallApi.tsx";
import {useCallback, useEffect, useState} from "react";
import CrosswordDisplay from "./CrosswordDisplay/CrosswordDisplay.tsx";
import crosswordDisplay from "./CrosswordDisplay/CrosswordDisplay.tsx";





function Crossword(){



    const location = useLocation();
    const words = location.state.map((arr: {color: number, text: string}[]) => {
        const row = arr.map((item) => item.text).join("");
        return row;

    });



    const [crossword, setCrossword] = useState([]);




    const displayArray = async () =>{
        const result = await callApi("http://localhost:3000/api/get-crossword");
        return result;
    }

    useEffect(() => {

        displayArray().then(
            result => setCrossword(result),
        );
    }, []);




    return(<>

            <CrosswordDisplay wordMap={crossword} />
        </>
    )
}

export default Crossword