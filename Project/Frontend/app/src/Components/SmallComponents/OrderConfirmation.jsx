import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./OrderConfirmation.css"
import TopNavbar from "../Navbars/TopNavbar";
import Navbar from "../Navbars/Navbar";
import Footer from "../Navbars/Footer";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const handleBackToShop = () => {
    navigate('/');
  };

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
                  src="https://scontent-lcy1-1.xx.fbcdn.net/v/t1.6435-9/31301640_2114242505489348_3921532491046846464_n.png?_nc_cat=104&ccb=1-3&_nc_sid=973b4a&_nc_ohc=pfOalMq8BzUAX-k-rhY&_nc_ht=scontent-lcy1-1.xx&oh=3af014dd12fa6e3d1816a3425a80e516&oe=609BE04A" 
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
                    <p>Your order #2465 has been successful!</p>
                    <p>
                      Thank you for choosing Oui Oui fashion. You will shortly receive a confirmation email.
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