import Home from "./Components/Pages/Home"
import { Route, Routes } from "react-router-dom"
import Login from "./Components/Pages/Login"
import LovedAuth from "./Components/Pages/LovedAuth"
import LovedNotAuth from "./Components/Pages/LovedNotAuth"
import Cart from "./Components/Pages/Cart"
import Account from "./Components/Pages/Account"
import NotFoundPage from "./Components/Pages/NotFoundPage"
import Products from "./Components/Pages/Products"
import ProductPage from "./Components/Pages/ProductPage"
import Orders from "./Components/Pages/Orders"
import PrivateRoute from "./endpoints/PrivateRoute"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/LovedAuth" element={<LovedAuth />} />
        <Route path="/LovedNotAuth" element={<LovedNotAuth />} />
        <Route path="/Cart" element={<Cart />} />
        
        <Route path="/Products" element={<Products />}>
          <Route path=":category" element={<Products />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/Product/:slug" element={<ProductPage />} />
       

                {/* Private routes wrapped under PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/orders" element={<Orders />}/>
          <Route path="/Account" element={<Account />} />
        </Route>
        
          {/* Add other private routes here */}
      </Routes>
    </>
  )
}

export default App
