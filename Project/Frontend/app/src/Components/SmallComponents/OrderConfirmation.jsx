import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./OrderConfirmation.css"
import TopNavbar from "../Navbars/TopNavbar";
import Navbar from "../Navbars/Navbar";
import Footer from "../Navbars/Footer";
import EshopLogo from './../../assets/logoo.png';
import { useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const handleBackToShop = () => {
    navigate('/');
  };
  const { state } = useLocation();
  const { orderId } = state || {};

  return (
    <>
      <TopNavbar />
      <Navbar />
      <div className='home-container'>
        <div className="container my-5">
          <div className="row">
            <div className="col-12">
              <div className="message-box">
                <div className="success-container">
                  <img
                    src={EshopLogo}
                    alt="Oui Oui Fashion Logo"
                    className="confirmation-logo"
                  />
                  <div className="confirmation-content">
                    <h1 className="confirmation-title">
                      Thank you for your order
                    </h1>
                    <div className="confirm-green-box">
                      <h5>ORDER CONFIRMATION</h5>
                      <p>Your order #{orderId} has been successful!</p>
                      <p>
                        Thank you for choosing THIS FUCKING BRILLIANT SHOP. You will shortly receive a confirmation email.
                      </p>
                    </div>
                    <button
                      onClick={handleBackToShop}
                      className="btn confirmation-btn"
                    >
                      Back to shop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default OrderConfirmation;