import React, { useEffect } from 'react';
import api from './endpoints/api';
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
import OrderConfirmation from './Components/SmallComponents/OrderConfirmation';
import Details from './Components/Pages/Details';
import { CartProvider } from './Components/SmallComponents/CartContext';
import ScrollToTop from './Components/SmallComponents/ScrollToTop';
import ForgotPassword from './Components/Pages/ForgotPassword';
import ResetPassword from './Components/Pages/ResetPassword';

function App() {

  useEffect(() => {
    const refreshAuthToken = async () => {
      try {
        const response = await api.post('/api/token/refresh/');

        if (response.data.refreshed) {
          localStorage.setItem("loggedIn", "true");
        } else {
          localStorage.setItem("loggedIn", "false");
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.setItem("loggedIn", "false");
      }
    };

    refreshAuthToken();
  }, []);
  return (
    <>
      {/*wrap ola ta routes gia einai apo pantou prosavasimi i timi tou cart*/}
      <ScrollToTop>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/LovedAuth" element={<LovedAuth />} />
            <Route path="/OurCompany" element={<OurCompany />} />
            <Route path="/Contact" element={<Contact />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
            
            {/* Products route with nested :category parameter */}
            <Route path="/Products" element={<Products />}>
              <Route path=":category" element={<Products />} />
            </Route>
            <Route path="/Product/:slug" element={<ProductPage />} />
            <Route path="*" element={<NotFoundPage />} />

            {/* Private routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/Cart" element={<Cart />} />
              <Route path="/Cart/Details" element={<Details />} />
              <Route path="/OrderConfirmation" element={<OrderConfirmation />} />
              <Route path="Account/*" element={<Account />}>
                <Route path="MyFavourites" element={<MyFavourites />} />
                <Route path="MyOrders" element={<MyOrders />} />
                <Route path="MySettings" element={<MySettings />} />
                <Route path="MyAccount/*" element={<MyAccount />} />
                <Route path="MyReviews" element={<MyReviews />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </ScrollToTop>
    </>
  );
}

export default App;
