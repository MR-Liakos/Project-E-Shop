import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Pages/Home";
import Login from "./Components/Pages/Login";
import LovedAuth from "./Components/Pages/LovedAuth";
import LovedNotAuth from "./Components/Pages/LovedNotAuth";
import Cart from "./Components/Pages/Cart";
import Account from "./Components/Pages/Account";
import NotFoundPage from "./Components/Pages/NotFoundPage";
import Products from "./Components/Pages/Products";
import ProductPage from "./Components/Pages/ProductPage";
import Orders from "./Components/Pages/Orders";
import PrivateRoute from "./endpoints/PrivateRoute";
import OurCompany from "./Components/Pages/OurCompany";
import Contact from "./Components/Pages/Contact";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/LovedAuth" element={<LovedAuth />} />
        <Route path="/LovedNotAuth" element={<LovedNotAuth />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/OurCompany" element={<OurCompany />} />
        <Route path="/Contact" element={<Contact />} />
        {/* Products route with nested :category parameter */}
        <Route path="/Products" element={<Products />}>
          <Route path=":category" element={<Products />} />
        </Route>
        <Route path="/Product/:slug" element={<ProductPage />} />
        <Route path="*" element={<NotFoundPage />} />
        
        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
