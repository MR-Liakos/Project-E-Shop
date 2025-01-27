import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
//import { login1 } from '../../endpoints/api';
import axios from 'axios'



export default function LoginForm() {
  const BASE_URL = "http://127.0.0.1:8000/api/"
  const LOGIN_URL = `${BASE_URL}token/`
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const login1 = async (username, password) => {
    const response = await axios.post(LOGIN_URL,
      { username: username, password: password },
      { withCredentials: true }
    )
    return (response.data.success)
  }

  const handleLoginClick = () => {
    login1(username, password)

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="modal show ModalCustom" tabIndex="-1" aria-labelledby="exampleModalLabel">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content FullModal">
          <div className='header-title'>
            <h1 className="modal-title fs-5 d-flex justify-content-center w-100" id="exampleModalLabel" style={{ paddingBottom: "5px" }}>
              Είσοδος
            </h1>
          </div>
          <div className="modal-body">
            <form id='form'   >
              <div className="form-floating mb-4 mt-4">
                <input
                  type="email"
                  className="form-control c-input"
                  id="loginEmail"
                  placeholder="E-mail"
                  name="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
