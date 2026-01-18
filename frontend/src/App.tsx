
import './App.css'

import {Routes, Route} from "react-router-dom";
import Crossword from "./Crossword.tsx";
import Home from "./Home.tsx";
import {useEffect} from "react";
import {callApi} from "./CallApi.tsx";




function App() {


    // when app loads or page reloads
    // reset everything on server to default values
    useEffect(() => {
        console.log("App mounted");
        callApi("/api/reset-vals").then((result)=>{
            console.log("Reset Status: " + result);
        });
    }, []);


  return (

          <Routes>
              <Route path="/" element={<Home/>}></Route>
              <Route path="/crossword" element={<Crossword/>} />
          </Routes>
      );
}


export default App
