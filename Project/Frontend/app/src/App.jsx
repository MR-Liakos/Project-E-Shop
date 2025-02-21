import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Pages/Home";
import Login from "./Components/Pages/Login";
import LovedAuth from "./Components/Pages/LovedAuth";
import Cart from "./Components/Pages/Cart";
import Account from "./Components/Pages/Account";
import NotFoundPage from "./Components/Pages/NotFoundPage";
import Products from "./Components/Pages/Products";
import ProductPage from "./Components/Pages/ProductPage";
import PrivateRoute from "./endpoints/PrivateRoute";
import OurCompany from "./Components/Pages/OurCompany";
import Contact from "./Components/Pages/Contact";
import MyAccount from "./Components/Pages/AccountTabs/MyAccount";
import MyFavourites from "./Components/Pages/AccountTabs/MyFavourites";
import MyOrders from "./Components/Pages/AccountTabs/MyOrders";
import MySettings from "./Components/Pages/AccountTabs/MySettings";
import MyReviews from "./Components/Pages/AccountTabs/MyReviews";
import Loved from "./Components/Pages/Loved";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/LovedAuth" element={<LovedAuth />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/OurCompany" element={<OurCompany />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Loved" element={<Loved />} />
        {/* Products route with nested :category parameter */}
        <Route path="/Products" element={<Products />}>
          <Route path=":category" element={<Products />} />
        </Route>
        <Route path="/Product/:slug" element={<ProductPage />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="Account/*" element={<Account />}>
            <Route path="MyFavourites" element={<MyFavourites />} />
            <Route path="MyOrders" element={<MyOrders />} />
            <Route path="MySettings" element={<MySettings />} />
            <Route path="MyAccount/*" element={<MyAccount />} />
            <Route path="MyReviews" element={<MyReviews />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
