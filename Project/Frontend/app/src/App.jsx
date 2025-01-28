import Home from "./Components/Pages/Home"
import {Route , Routes} from "react-router-dom"
import Login from "./Components/Pages/Login"
import LovedAuth from "./Components/Pages/LovedAuth"
import LovedNotAuth from "./Components/Pages/LovedNotAuth"
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/LovedAuth" element={<LovedAuth/>}/>
        <Route path="/LovedNotAuth" element={<LovedNotAuth/>}/>
      </Routes>
    </>
  )
}

export default App
