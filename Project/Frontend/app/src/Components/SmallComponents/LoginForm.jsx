import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import axios from 'axios';


export default function LoginForm() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", formData);
      console.log("Success!", response.data);
      setSuccessMessage("Login Successful!");
      //localStorage.setItem("accessToken", response.data.tokens.access);// exv error an ta svisv tha figei
      //localStorage.setItem("refreshToken", response.data.tokens.refresh);//
    }
    catch (error) {
      console.log("Error during Login!", error); // Log the full error object
      console.log("Error response data:", error.response?.data); // Log the response data if it exists
      if (error.response && error.response.data) {
        Object.keys(error.response.data).forEach(field => {
          const errorMessages = error.response.data[field];
          if (errorMessages && errorMessages.length > 0) {
            setError(errorMessages[0]);
          }
        })
      }
    }
    finally {
      setIsLoading(false)
    }

  };
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="modal show ModalCustom" tabIndex="-1" aria-labelledby="exampleModalLabel">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content FullModal">
          <div className='header-title'>
            <h1 className="modal-title fs-5 d-flex justify-content-center w-100 text-decoration-underline" id="exampleModalLabel" style={{ paddingBottom: "5px" }}>
              Είσοδος
            </h1>
          </div>
          <div className="modal-body">
            <form id='formLogin'   >
              <div className="form-floating mb-4 mt-4">
                <input
                  type="email"
                  className="form-control c-input"
                  id="loginEmail"
                  placeholder="E-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}

                />
                <label htmlFor="loginEmail">*E-mail </label>
                <MdOutlineMailOutline
                  className='email-icon'
                  size={"1.4rem"}
                />
              </div>
              <div className="form-floating mb-4 position-relative input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control c-input"
                  id="loginPassword"
                  placeholder="Κωδικός"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}

                />
                <label htmlFor="loginPassword">*Κωδικός</label>
                {showPassword ? (
                  <IoEye
                    className="toggle-password-icon"
                    onClick={togglePasswordVisibility}
                    size={"1.2rem"}
                  />
                ) : (
                  <IoEyeOff
                    className="toggle-password-icon"
                    onClick={togglePasswordVisibility}
                    size={"1.2rem"}
                  />
                )}
              </div>
              <div className='forgot-checkbox'>
                <input type="checkbox" id='RememberMe' />
                <label htmlFor="RememberMe">Να με θυμάσαι</label>
                <Link to="#" className="btn forgot">Ξέχασες τον κωδικό σου?</Link>
              </div>
              <div className="modal-footer modalbtn">
                <div className="d-flex justify-content-center w-100">
                  <button type="submit" disabled={isLoading} onClick={handleSubmit} className="btn py-2 btnlogin" >Είσοδος</button>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <div className="d-flex justify-content-center w-100">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
