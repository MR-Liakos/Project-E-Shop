import React, { useState, useEffect } from "react";
import "./MyAccount.css";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools';

const MyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  // Φόρτωμα αρχικών δεδομένων χρήστη
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setUserData(response.data);
        reset(response.data); // Προσθήκη τιμών στο form
      } catch (error) {
        console.error("Σφάλμα φόρτωσης δεδομένων:", error);
        if (error.response?.status === 401) {
          window.location.href = '/login'; // Ανακατεύθυνση αν δεν είναι συνδεδεμένος
        }
      }
    };

    fetchUserData();
  }, [reset]);

  const onSubmit = async (data) => {
    if (isLoading) return;

    clearErrors();
    setIsLoading(true);

    try {
      const response = await axios.patch( // THELOUME PATCH METHOD!!!!! 
        "http://127.0.0.1:8000/api/user/",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,// DEN EXW IDEA TI KANEI 
          },
        }
      );

      setSuccessMessage("Τα στοιχεία ενημερώθηκαν επιτυχώς!");
      setShowSuccessModal(true);
      reset(response.data); // Ενημέρωση φόρμας με νέα δεδομένα
      setUserData(response.data); // Ενημέρωση state
    } catch (error) {
      if (error.response?.data) {
        const serverErrors = error.response.data;
        Object.keys(serverErrors).forEach((field) => {
          setError(field, {
            type: "server",
            message: serverErrors[field][0],
          });
        });
      }
      setShowFailModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Φόρτωση...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="myaccount-content">
        <h2>Στοιχεία Λογαριασμού</h2>
        <form id='formdata' onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-floating mb-4 mt-4 position-relative">
            <input
              type="text"
              className={`form-control c-input ${errors.first_name ? 'is-invalid' : ''}`}
              id="firstName"
              placeholder="First Name"
              defaultValue={userData.first_name}
              {...register("first_name", {
                required: {
                  value: true,
                  message: "Το όνομα είναι υποχρεωτικό",
                }
              })}
            />
            <label htmlFor="firstName">*Όνομα</label>
            {errors.first_name && (
              <div className="invalid-feedback">
                {errors.first_name.message}
              </div>
            )}
          </div>

          <div className="form-floating mb-4">
            <input
              type="text"
              className={`form-control c-input ${errors.last_name ? 'is-invalid' : ''}`}
              id="last_name"
              placeholder="Επίθετο*"
              defaultValue={userData.last_name}
              {...register("last_name", {
                required: {
                  value: true,
                  message: "Το επίθετο είναι υποχρεωτικό",
                }
              })}
            />
            <label htmlFor="last_name">*Επώνυμο</label>
            {errors.last_name && (
              <div className="invalid-feedback">
                {errors.last_name.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span className="ms-2">Αποθήκευση...</span>
              </>
            ) : (
              "Αποθήκευση Αλλαγών"
            )}
          </button>
        </form>

        <DevTool control={control} />

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Επιτυχία!</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowSuccessModal(false)}
                  ></button>
                </div>
                <div className="modal-body">{successMessage}</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showFailModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Σφάλμα!</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFailModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  Υπήρξε ένα σφάλμα κατά την αποθήκευση των αλλαγών.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;