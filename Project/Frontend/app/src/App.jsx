import Home from "./Components/Pages/Home"
import {Route , Routes} from "react-router-dom"
import Login from "./Components/Pages/Login"
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Login" element={<Login/>}/>

      </Routes>
    </>
  )
}

export default App
