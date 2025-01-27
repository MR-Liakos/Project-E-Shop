import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div
      className="modal show ModalCustom"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content FullModal">
          <div className="header-title">
            <h1
              className="modal-title fs-5 d-flex justify-content-center w-100"
              id="exampleModalLabel"
              style={{ paddingBottom: "5px" }}
            >
              Δημιουργία Λογαριασμού
            </h1>
          </div>
          <div className="modal-body">
            <form id="form">
              

              {/* Όνομα, Επίθετο, Τηλέφωνο */}
              <div className="form-floating mb-4">
                <input
                  type="text"
                  className="form-control c-input"
                  id="name"
                  placeholder="Όνομα*"
                  name="name"
                  required
                />
                <label htmlFor="name">*Όνομα</label>
              </div>
              <div className="form-floating mb-4">
                <input
                  type="text"
                  className="form-control c-input"
                  id="surname"
                  placeholder="Επίθετο*"
                  name="surname"
                  required
                />
                <label htmlFor="surname">*Επίθετο</label>
              </div>
              <div className="form-floating mb-4">
                <input
                  type="tel"
                  className="form-control c-input"
                  id="phone"
                  placeholder="Τηλέφωνο*"
                  name="phone"
                  required
                />
                <label htmlFor="phone">*Τηλέφωνο</label>
              </div>
{/* E-mail */}
<div className="form-floating mb-4 mt-4">
                <input
                  type="email"
                  className="form-control c-input"
                  id="loginEmail"
                  placeholder="E-mail"
                  name="email"
                  required
                />
                <label htmlFor="loginEmail">*E-mail</label>
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
                  id="loginPassword"
                  placeholder="Κωδικός"
                  name="password"
                  required
                />
                <label htmlFor="loginPassword">*Κωδικός</label>
                {showPassword ? (
                  <IoEye
                    className="toggle-password-icon"
                    onClick={togglePasswordVisibility}
                    size="1.2rem"
                  />
                ) : (
                  <IoEyeOff
                    className="toggle-password-icon"
                    onClick={togglePasswordVisibility}
                    size="1.2rem"
                  />
                )}
              </div>

              {/* Επιβεβαίωση Κωδικού */}
              <div className="form-floating mb-4 position-relative input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control c-input"
                  id="confirmPassword"
                  placeholder="Επιβεβαίωση Κωδικού"
                  name="confirmPassword"
                  required
                />
                <label htmlFor="confirmPassword">*Επιβεβαίωση Κωδικού</label>
                {showPassword ? (
                  <IoEye
                    className="toggle-password-icon"
                    onClick={togglePasswordVisibility}
                    size="1.2rem"
                  />
                ) : (
                  <IoEyeOff
                    className="toggle-password-icon"
                    onClick={togglePasswordVisibility}
                    size="1.2rem"
                  />
                )}
              </div>
              {/* Ραδιοκουμπιά */}
              <div className="mb-4">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                    value="Άνδρας"
                  />
                  <label className="form-check-label" htmlFor="male">
                    Άνδρας
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                    value="Γυναίκα"
                  />
                  <label className="form-check-label" htmlFor="female">
                    Γυναίκα
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="other"
                    value="Άλλο"
                  />
                  <label className="form-check-label" htmlFor="other">
                    Άλλο
                  </label>
                </div>
              </div>

              {/* Κουμπί */}
              <div className="modal-footer modalbtn">
                <div className="d-flex justify-content-center w-100">
                  <button
                    className="btn py-2 btnlogin"
                    type="submit"
                    value="Εγγραφή"
                  >
                    Εγγραφή
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}