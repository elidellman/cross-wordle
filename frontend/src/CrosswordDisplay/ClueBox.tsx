import styles from "./ClueBox.module.css";
import {callApi} from "../CallApi.tsx";
import {useEffect, useState} from "react";



interface ClueBoxProps {
    wordCords: [number, number];
}

function ClueBox(props: ClueBoxProps) {

    const {wordCords = [-1,-1]} = props;

    const [clue, setClue] = useState<string>("");



    //on mount
    useEffect(() => {
            callApi(`http://localhost:3000/api/get-clue`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({text: wordCords})
            }).then(response=>setClue(response));


            return()=>{

            }


    }, [wordCords]);


    return (

       <>
        <div className={styles.Card}>
            <div className={styles.Title}>
                <p className={styles.Clue}>
                    {clue}
                </p>
            </div>



        </div>
       </>

    )
}

export default ClueBox;