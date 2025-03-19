import React, { useEffect, useState,useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools'
import api from '../../endpoints/api';
import { CartContext } from './CartContext';


export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm()
  const { register, control, handleSubmit, formState, clearErrors } = form
  const { errors } = formState;
  const { fetchCartQuantity } = useContext(CartContext);
  const isLoggedInLocal = localStorage.getItem("loggedIn");

  useEffect(() => {
    // Effect logic here
    console.log(isLoggedInLocal);
    
    if (isLoggedInLocal == 'true') {
      window.location.href = "https://users.it.teithe.gr/~georrets/Eshop/";
      return;
    }

  }, );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    if (isLoading) return;

    clearErrors();
    setIsLoading(true);
    setLoginError(""); // Clear previous errors

    try {
      const response = await api.post("api/token/", data, { withCredentials: true });

      // Check if the backend returned success: false
      if (response.data && response.data.success === false) {
        setLoginError("Invalid email or password.");
        return; // Stop further execution so we don't navigate
      }
      localStorage.setItem('loggedIn', 'true');
      console.log("Success Logged in!");
      await fetchCartQuantity();
      window.location.href = "https://users.it.teithe.gr/~georrets/Eshop/";
      navigate('/');
    } catch (error) {
      localStorage.setItem('loggedIn', 'false');
      console.error("Error during Login!", error);
      // If the error object contains a message, show it
      if (error.response && error.response.data) {
        // This assumes your error response structure might include an error message
        const backendError = error.response.data.error || "Login failed.";
        setLoginError(backendError);
      } else {
        setLoginError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }


  return (
    <>
      <div className="modal show ModalCustom" tabIndex="-1" aria-labelledby="exampleModalLabel">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content FullModal ">
            <div className='header-title'>
              <h1 className="modal-title fs-5 d-flex justify-content-center w-100 text-decoration-underline" id="exampleModalLabel" >
                Είσοδος
              </h1>
            </div>
            <div className="modal-body loginform">
              {/* Display the login error message */}
              {loginError && <p className="error">{loginError}</p>}

              <form id='formLogin' onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-floating mb-4 mt-4 position-relative">
                  <input
                    type="email"
                    className="form-control c-input"
                    id="loginEmail"
                    placeholder="E-mail"
                    name="email"
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Το email είναι υποχρεωτικό",
                      }
                    })}
                  />
                  <p className="errors">{errors.email?.message}</p>
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
                    {...register("password", {
                      required: "Ο κωδικός είναι υποχρεωτικός",
                    })}
                  />
                  <p className="errors">{errors.password?.message}</p>
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
                  <div className='remember'>
                    <input type="checkbox" id='RememberMe' />
                    <label className='rememberme' htmlFor="RememberMe">Να με θυμάσαι</label>
                  </div>
                  <Link to="/forgot-password" className="btn forgot">Ξέχασες τον κωδικό σου?</Link>
                </div>
                <div className="modal-footer modalbtn">
                  <div className="d-flex justify-content-center w-100">
                    <button type="submit" disabled={isLoading} className="btn py-2 btnlogin">
                      Είσοδος
                    </button>
                  </div>
                </div>
              </form>
              <DevTool control={control} />
            </div>
            <div className="modal-footer">
              <div className="d-flex justify-content-center w-100">
                {/* Additional footer content if needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

}