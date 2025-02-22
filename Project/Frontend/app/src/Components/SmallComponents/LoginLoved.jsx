import React, { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginLoved.css';
import { FcGoogle } from "react-icons/fc";

export default function LoginLoved() {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate('/Login')
  }

  return (
    <>
      <div className="modal show ModalCustom c-modalLoved" tabIndex="-1" aria-labelledby="exampleModalLabel">
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

              <div className='Google-Login'>
                <button className='c-buttonGoogle d-flex align-items-center justify-content-center gap-2' type='button'>
                  <FcGoogle  className="c-google-icon" />
                  Συνέχεια με Google
                </button>
              </div>

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
