import {Link, useLocation} from "react-router-dom";
import {callApi} from "./CallApi.tsx";





function Crossword(){


    const location = useLocation();
    const words = location.state.map((arr: {color: number, text: string}[]) => {
        const row = arr.map((item) => item.text).join("");
        return row;

    });

    callApi("http://localhost:3000/api/get-crossword")

    console.log(words);

    return <h2>HElO</h2>
}

export default Crossword