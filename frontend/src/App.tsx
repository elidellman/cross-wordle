
import './App.css'

import {Routes, Route} from "react-router-dom";
import Crossword from "./Crossword.tsx";
import Home from "./Home.tsx";

/*
* Function calls general backend API and sets a new state to hold data
* */





function App() {







    // this is for testing, eventually get this array from the api




  return (

          <Routes>
              <Route path="/" element={<Home/>}></Route>
              <Route path="/crossword" element={<Crossword/>} />
          </Routes>
      );
}


export default App
