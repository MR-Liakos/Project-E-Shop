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
    <div style={{ background: '#f8f9fa' }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="message-box">
              <div className="success-container">
                <br />
                <img 
                  src= {EshopLogo}
                  alt="Oui Oui Fashion Logo"
                  style={{ height: '100px' }} 
                />
                <br />
                <div style={{ padding: '0 5%' }}>
                  <hr />
                  <br />
                  <h1 className="monserrat-font" style={{ color: 'grey' }}>
                    Thank you for your order
                  </h1>
                  <br />
                  <div className="confirm-green-box">
                    <br />
                    <h5>ORDER CONFIRMATION</h5>
                    <p>Your order #{orderId} has been successful!</p>
                    <p>
                      Thank you for choosing THIS FUCKING BRILLIANT SHOP. You will shortly receive a confirmation email.
                    </p>
                  </div>
                  <br />
                  <button 
                    onClick={handleBackToShop}
                    className="btn btn-ouioui-secondary margin-left-5px"
                  >
                    Back to shop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default OrderConfirmation;