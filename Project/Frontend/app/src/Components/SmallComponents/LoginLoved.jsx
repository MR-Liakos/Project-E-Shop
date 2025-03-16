import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginLoved.css';
import api from '../../endpoints/api';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import { CartContext } from './CartContext';
export default function LoginLoved() {

  const { fetchCartQuantity } = useContext(CartContext);

  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate('/Login')
  }

  const login = useGoogleLogin({
    onSuccess: async codeResponse => {
      console.log(codeResponse.access_token);
      try {
        const response = await api.post("api/auth/google/", { access_token: codeResponse.access_token });
        console.log("Server Response:", response.data);

        // Check if the response indicates a successful login/registration
        if (response.data && response.data.email) {  // adjust condition based on your response structure
          // Set flag in local storage
          localStorage.setItem('loggedIn', 'true');
          // Update local state variable to indicate successful Google login
          await fetchCartQuantity();
          window.location.href = "http://localhost:5173/";
          navigate('/');
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    onError: error => console.log('Login Failed:', error)

  });

  return (
    <>
      <div className="modal show ModalCustom c-modalLoved" aria-labelledby="exampleModalLabel">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content FullModal">
            <div className='header-title'>
              <h1 className="modal-title  d-flex align-items-center justify-content-center w-100 text-center loved-title" id="exampleModalLabel">
                Ένα βήμα πριν
              </h1>
            </div>
            <div className="modal-body login-container">
              {/* Added label for loved ones */}
              <p className=" text-muted mb-3 text-center my-3 loved-text">
                Για να προσθέσεις το προϊόν στα Αγαπημένα σου, κάνε σύνδεση ή εγγραφή, με έναν από τους παρακάτω τρόπους:
              </p>
              <button className='c-buttonGoogle' onClick={() => login()}><FcGoogle   className='c-google-icon'/>Sign in with Google</button>

              <button className='c-buttonLogin d-flex align-items-center justify-content-center mt-3' type='button' onClick={handleOnClick}>
                Σύνδεση ή Εγγραφή
              </button>

            </div>
            <div className="modal-footer">
              <div className="d-flex justify-content-center w-100">
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
