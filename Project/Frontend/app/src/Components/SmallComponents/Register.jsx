import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import axios from 'axios';
import SuccessRegister from '../Modals/SuccessRegister.jsx';
import FailRegister from '../Modals/FailRegister.jsx';
import { useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools'

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);

  const form = useForm()
  const { register, control, handleSubmit, formState, watch, clearErrors } = form
  const { errors } = formState;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    if (isLoading) return

    clearErrors()
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", data);

      console.log("Success!", response.data);
      setSuccessMessage("Register Successful!");
      setShowSuccessModal(true)
      form.reset()
    }
    catch (error) {
      if (error.response?.data) {
        const serverErrors = error.response.data;
        Object.keys(serverErrors).forEach((field) => {
          form.setError(field, {
            type: "server",
            message: serverErrors[field][0],
          });
        });
      }
      setShowFailModal(true);
    }
    finally {
      setIsLoading(false)
    }
  };

  // In SuccessRegister component:
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        navigate('/'); // Redirect after 3 seconds
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);


  return (
    <>
      <div
        className="modal show ModalCustom"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content FullModal">
            <div className="header-title">
              <h1
                className="modal-title fs-5 d-flex justify-content-center w-100 text-decoration-underline "
                id="exampleModalLabel"
                style={{ marginBottom: "1.5rem" }}
              >
                Δημιουργία Λογαριασμού
              </h1>
            </div>
            <div className="modal-body">
              <form id="formRegister" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Όνομα, Επίθετο, Τηλέφωνο */}
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control c-input"
                    id="name"
                    placeholder="Όνομα*"
                    {...register("first_name", {
                      required: {
                        value: true,
                        message: "Το όνομα είναι υποχρεωτικό",
                      }
                    })}
                  />
                  <p className="errors">{errors.first_name?.message}</p>
                  <label htmlFor="name">*Όνομα</label>
                </div>

                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control c-input"
                    id="last_name"
                    placeholder="Επίθετο*"
                    {...register("last_name", {
                      required: {
                        value: true,
                        message: "Το επίθετο είναι υποχρεωτικό",
                      }
                    })}
                  />
                  <p className="errors">{errors.last_name?.message}</p>
                  <label htmlFor="last_name">*Επίθετο</label>
                </div>

                <div className="form-floating mb-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-control c-input"
                    id="phone"
                    placeholder="Τηλέφωνο*"
                    {...register("phone", {
                      required: "Το τηλέφωνο είναι υποχρεωτικό",
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Πρέπει να είναι ακριβώς 10 ψηφία"
                      }
                    })}
                  />
                  <label htmlFor="phone">*Τηλέφωνο</label>
                  <p className="errors">{errors.phone?.message}</p>
                </div>

                {/* E-mail */}
                <div className="form-floating mb-4 mt-4">
                  <input
                    type="email"
                    className="form-control c-input"
                    id="RegisterEmail"
                    placeholder="E-mail"
                    {...register("email", {
                      required: {
                        value: true,  // Correct required validation
                        message: "Το email είναι υποχρεωτικό"
                      },
                      pattern: {  // Separate pattern validation
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Παρακαλώ εισάγεται ένα κανονικό email"
                      }
                    })}
                  />
                  <p className="errors">{errors.email?.message}</p>
                  <label htmlFor="RegisterEmail">*E-mail</label>
                  <MdOutlineMailOutline
                    className="email-icon"
                    size="1.4rem"
                  />
                </div>

                {/* Κωδικός */}
                <div className="form-floating mb-4 position-relative input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control c-input"
                    id="RegisterPassword"
                    placeholder="Κωδικός"
                    {...register("password1", {
                      required: "Ο κωδικός είναι υποχρεωτικός",
                      minLength: {
                        value: 6,
                        message: "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες",
                      }
                    })}
                  />
                  <p className="errors">{errors.password1?.message}</p>
                  <label htmlFor="RegisterPassword">*Κωδικός</label>
                  {showPassword ? (
                    <IoEye className="toggle-password-icon" onClick={togglePasswordVisibility} size="1.2rem" />
                  ) : (
                    <IoEyeOff className="toggle-password-icon" onClick={togglePasswordVisibility} size="1.2rem" />
                  )}
                </div>

                {/* Επιβεβαίωση Κωδικού */}
                <div className="form-floating mb-4 position-relative input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control c-input"
                    id="confirmRegPassword"
                    placeholder="Επιβεβαίωση Κωδικού"
                    {...register("password2", {
                      required: "Η επιβεβαίωση κωδικού είναι υποχρεωτική",
                      validate: (value) =>
                        value === watch("password1") || "Οι κωδικοί δεν ταιριάζουν",
                    })}
                  />
                  <p className="errors">{errors.password2?.message}</p>
                  <label htmlFor="confirmRegPassword">*Επιβεβαίωση Κωδικού</label>
                  {showPassword ? (
                    <IoEye className="toggle-password-icon" onClick={togglePasswordVisibility} size="1.2rem" />
                  ) : (
                    <IoEyeOff className="toggle-password-icon" onClick={togglePasswordVisibility} size="1.2rem" />
                  )}
                </div>


                {/* Κουμπί */}
                <div className="modal-footer modalbtn">
                  <div className="d-flex justify-content-center w-100">
                    <button
                      className="btn py-2 btnlogin"
                      type="submit"
                      value="Εγγραφή"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Εγγραφή'}
                    </button>
                  </div>
                </div>

              </form>

              <DevTool control={control} />
            </div>
          </div>
        </div >
      </div >
      <SuccessRegister
        showModal={showSuccessModal}
        setShowModal={setShowSuccessModal}
      />
      <FailRegister
        showModal={showFailModal}
        setShowModal={setShowFailModal}
      />
    </>
  );
}