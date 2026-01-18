import {callApi} from "./CallApi.tsx";
import {useEffect, useState} from "react";
import CrosswordDisplay from "./CrosswordDisplay/CrosswordDisplay.tsx";





function Crossword(){
    //const location = useLocation();
    /*const words = location.state.map((arr: {color: number, text: string}[]) => {
        const row = arr.map((item) => item.text).join("");
        return row;

    });
*/


    const [crossword, setCrossword] = useState([]);

    const displayArray = async () =>{
        return await callApi("/api/get-crossword");

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