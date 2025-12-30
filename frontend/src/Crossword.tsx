import {Link, useLocation} from "react-router-dom";

function Crossword(){


    const location = useLocation();
    const words = location.state;


    console.log(words);

    return <h2>HElO</h2>
}

export default Crossword