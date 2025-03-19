import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { appendErrors, useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools'
import api from "../../endpoints/api.js";
import { MdOutlineStarPurple500 } from "react-icons/md";


export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const form = useForm()
  const { register, control, handleSubmit, formState, watch, clearErrors } = form
  const { errors } = formState;
  const [showSuccessModal2, setshowSuccessModal2] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    if (isLoading) return

    clearErrors()
    setIsLoading(true);
    try {
      const response = await api.post("api/register/", data);
      if (response.data.email[0] === 'This email is already registered.') {
        setLoginError("This email is already registered.");
        return; // Stop further execution so we don't navigate
      }
      setshowSuccessModal2(true);
      setTimeout(() => {
        setshowSuccessModal2(false); // Κρύψτε το modal
        form.reset(); // Επαναφορά της φόρμας
      }, 4000);
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
              >
                Δημιουργία Λογαριασμού
              </h1>
            </div>
            <div className="modal-body">
              {loginError && <p className="errors" style={{ color: "red", textAlign: "center" }}>{loginError}</p>}
              <form id="formRegister" className="mt-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Όνομα, Επίθετο, Τηλέφωνο */}
                <div className="form-floating mb-4 input-cont">
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

                <div className="form-floating mb-4 input-cont">
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

                <div className="form-floating mb-4 input-cont">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-control c-input"
                    id="phone"
                    placeholder="Τηλέφωνο*"
                    {...register("phone", {
                      required: "Το τηλέφωνο είναι υποχρεωτικό",
                      pattern: {
                        value: /^69\d{8}$/,
                        message: "Το τηλέφωνο πρέπει να ξεκινά με 69 και να έχει ακριβώς 10 ψηφία"
                      }
                    })}
                  />
                  <label htmlFor="phone">*Τηλέφωνο</label>
                  <p className="errors">{errors.phone?.message}</p>
                </div>

                {/* E-mail */}
                <div className="form-floating mb-4 mt-4 input-cont">
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
                <div className="form-floating mb-4 position-relative input-cont">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control c-input"
                    id="RegisterPassword"
                    placeholder="Κωδικός"
                    {...register("password1", {
                      required: "Ο κωδικός είναι υποχρεωτικός",
                      minLength: {
                        value: 8,
                        message: "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες",
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
                <div className="form-floating mb-4 position-relative input-cont">
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

                <div className="Terms-Cond">
                  <input
                    type="checkbox"
                    id="TermsCond"
                    {...register("terms", { required: true })}
                  />
                  <label htmlFor="TermsCond">Αποδέχομαι τους όρους χρήσης</label>
                </div>
                {errors.terms && <p className="errors">Πρέπει να αποδεχτείτε τους όρους χρήσης για την εγγραφή</p>}

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
              {/* <DevTool control={control} /> */}
            </div>
          </div>
        </div >
      </div >
      {showSuccessModal2 && (
        <div className="success-message visible">
          <MdOutlineStarPurple500 className="success-icon" />
          🎉 Η εγγραφή σας ολοκληρώθηκε επιτυχώς! Παρακαλώ Συνδεθείτε!
        </div>
      )}
    </>
  );
}