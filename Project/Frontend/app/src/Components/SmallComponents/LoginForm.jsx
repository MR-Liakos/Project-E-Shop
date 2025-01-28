import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
//import { login1 } from '../../endpoints/api';
import axios from 'axios';


export default function LoginForm() {

  const BASE_URL = "http://127.0.0.1:8000/api/"
  const LOGIN_URL = `${BASE_URL}token/`

  const [showPassword, setShowPassword] = useState(false);
  //const navigate = useNavigate();

  const [email2, setEmail] = useState(""); // Use email instead of username
  const [password2, setPassword] = useState("");

  const login1 = async (email, password) => {
    try {
      const response = await axios.post(
        LOGIN_URL,
        { email: email, password: password },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
      throw error;
    }
  };
  
  const handleLoginClick = () => {
    
    login1(email2, password2)
    
  };

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
                  value={email2}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  value={password2}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                  <button onClick={handleLoginClick} className="btn py-2 btnlogin" type="submit">Είσοδος</button>
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
