import Home from "./Components/Pages/Home"
import {Route , Routes} from "react-router-dom"
import Login from "./Components/Pages/Login"
import LovedAuth from "./Components/Pages/LovedAuth"
import LovedNotAuth from "./Components/Pages/LovedNotAuth"
import Cart from "./Components/Pages/Cart"
import Account from "./Components/Pages/Account"
import NotFoundPage from "./Components/Pages/NotFoundPage"
import Afroloutra from "./Components/Pages/Afroloutra"
import ProductPage from "./Components/Pages/ProductPage"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/LovedAuth" element={<LovedAuth/>}/>
        <Route path="/LovedNotAuth" element={<LovedNotAuth/>}/>
        <Route path="/Cart" element={<Cart/>}/>
        <Route path="/Account" element={<Account/>}/>
        <Route path="/Afroloutra" element={<Afroloutra/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
        <Route path="/Product/:slug" element={<ProductPage/>}/>
        

      </Routes>
    </>
  )
}

export default App
