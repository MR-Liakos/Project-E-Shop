import React, { useState, } from 'react';
import {  useNavigate } from 'react-router-dom';
import './LoginLoved.css';
import { FcGoogle } from "react-icons/fc";
import { FaHeart } from "react-icons/fa";

export default function LoginLoved() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('')

  const handleOnClick=()=>{
    navigate('/Login')
  }

  return (
    <>
      <div className="modal show ModalCustom c-modalLoved" tabIndex="-1" aria-labelledby="exampleModalLabel">
        <div className="modal-dialog modal-dialog-centered" style={{border: "1px solid grey",borderRadius: "4px"}}>
          <div className="modal-content FullModal">
            <div className='header-title'>
              <h1 className="modal-title fs-5 d-flex align-items-center justify-content-center w-100 text-center" id="exampleModalLabel" style={{ paddingBottom: "5px" }}>
                Ένα βήμα πριν
                <FaHeart
                  size="1.1rem"
                  color="red"
                  className="align-middle"
                  style={{
                    marginLeft: "0.4rem",
                    verticalAlign: "middle",
                    transform: "translateY(3px)"
                  }}
                />
              </h1>
            </div>
            <div className="modal-body">
              {/* Added label for loved ones */}
              <h5 className="h6 text-muted mb-3 text-center my-3">
                Για να προσθέσεις το προϊόν στα Αγαπημένα σου, κάνε σύνδεση ή εγγραφή, με έναν από τους παρακάτω τρόπους:
              </h5>

              <button className='c-buttonGoogle d-flex align-items-center justify-content-center mt-3' type='button'>
                <FcGoogle size={30} className="c-google-icon me-2 position-absolute start-0 ms-4" />
                Συνέχεια με Google
              </button>

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
