import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools'


export default function LoginForm() {
  axios.defaults.withCredentials = true;

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null)
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm()
  const { register, control, handleSubmit, formState,  clearErrors } = form
  const { errors } = formState;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    console.log(data.email)  // etsi pairno dedomena
    if (isLoading) return

    clearErrors()
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", data, { withCredentials: true });

      console.log("Success!", response.data);
      setSuccessMessage("Login Successful!");
      localStorage.setItem("accessToken", response.data.access);// ta apothikeuei local browser
      localStorage.setItem("refreshToken", response.data.refresh);

      const timer = setTimeout(() => {
        navigate('/'); // Redirect after 1.5 seconds
      }, 1500);
      return () => clearTimeout(timer);
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

  return (
    <>
      <div className="modal show ModalCustom" tabIndex="-1" aria-labelledby="exampleModalLabel">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content FullModal">
            <div className='header-title'>
              <h1 className="modal-title fs-5 d-flex justify-content-center w-100 text-decoration-underline" id="exampleModalLabel" style={{ paddingBottom: "5px" }}>
                Είσοδος
              </h1>
            </div>
            <div className="modal-body">
              <form id='formLogin'onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-floating mb-4 mt-4 position-relative">
                  <input
                    type="email"
                    className="form-control c-input "
                    id="loginEmail"
                    placeholder="E-mail"
                    name="email"
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Το όνομα είναι υποχρεωτικό",
                      }
                    })}
                  />
                  <p className="errors">{errors.email?.message}</p>
                  <label htmlFor="loginEmail">*E-mail </label>
                  <div className="invalid-tooltip">
                    Please provide a valid city.
                  </div>
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
                  <div className="invalid-tooltip">
                    Please provide a valid city.
                  </div>

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
              <DevTool control={control}/>
            </div>
            <div className="modal-footer">
              <div className="d-flex justify-content-center w-100">
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}