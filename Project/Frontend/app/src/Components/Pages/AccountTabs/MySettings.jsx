import React, { useState, useEffect } from "react";
import "./MySettings.css";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools';
import { IoEye, IoEyeOff } from "react-icons/io5";

const MySettings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [userData, setUserData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
        setError,
        clearErrors
    } = useForm();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/user/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                setUserData(response.data);
                reset(response.data);
            } catch (error) {
                console.error("Σφάλμα φόρτωσης δεδομένων:", error);
                if (error.response?.status === 401) {
                    window.location.href = '/login';
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
            // 1. Έλεγχος αν ο παλιός κωδικός είναι σωστός ???????????????
            const verifyResponse = await axios.post(
                "http://127.0.0.1:8000/api/verify-password/",
                { password: data.old_password },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );

            if (!verifyResponse.data.is_valid) {
                throw new Error("Ο παλιός κωδικός δεν είναι σωστός");
            }

            // 2. Αλλαγή κωδικού  ???????????????
            const changeResponse = await axios.patch(
                "http://127.0.0.1:8000/api/change-password/",
                {
                    old_password: data.old_password,
                    new_password: data.new_password
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );

            setSuccessMessage("Ο κωδικός ενημερώθηκε επιτυχώς!");
            setShowSuccessModal(true);
            reset();
        } catch (error) {
            if (error.response?.data) {
                const serverErrors = error.response.data;
                Object.keys(serverErrors).forEach((field) => {
                    setError(field, {
                        type: "server",
                        message: serverErrors[field][0],
                    });
                });
            } else if (error.message.includes("παλιός κωδικός")) {
                setError("old_password", {
                    type: "manual",
                    message: "Ο παλιός κωδικός δεν είναι σωστός"
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
        <>
            <div className="tab-content">
                <div className="settings-content">
                    <h2 className="h2-tags text-decoration-underline text-center">Ρυθμίσεις Λογαριασμού</h2>
                    <form id='formdata' onSubmit={handleSubmit(onSubmit)} noValidate>
                        {/* Πεδίο Τηλεφώνου */}
                        <h5 className="h5-tags">Τηλέφωνο Επικοινωνίας</h5>
                        <div className="form-floating mb-4 mt-4 position-relative">
                            <input
                                type="text"
                                inputMode="numeric"
                                className={`form-control cu-input ${errors.phone ? 'is-invalid' : ''}`}
                                id="phone"
                                placeholder="Τηλέφωνο"
                                defaultValue={userData.phone}
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

                        <h5 className="h5-tags">Αλλαγή Κωδικού Πρόσβασης</h5>
                        {/* Παλιός Κωδικός */}
                        <div className="form-floating mb-4 input-container" style={{width: "fit-content"}}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`form-control cu-input ${errors.old_password ? 'is-invalid' : ''}`}
                                id="old_password"
                                placeholder="Παλιός Κωδικός"
                                {...register("old_password", {
                                    required: "Ο παλιός κωδικός δεν ταιριάζει"
                                })}
                            />
                            <label htmlFor="old_password">*Παλιός Κωδικός</label>
                            {showPassword ? (
                                <IoEye className="toggle-password-icon" onClick={togglePasswordVisibility} size="1.2rem" />
                            ) : (
                                <IoEyeOff className="toggle-password-icon" onClick={togglePasswordVisibility} size="1.2rem" />
                            )}
                            <p className="errors">{errors.password1?.message}</p>
                        </div>

                        {/* Νέος Κωδικός */}
                        <div className="form-floating mb-4 position-relative input-container"style={{width: "fit-content"}}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`form-control cu-input ${errors.new_password ? 'is-invalid' : ''}`}
                                id="new_password"
                                placeholder="Νέος Κωδικός"
                                {...register("new_password", {
                                    required: "Ο νέος κωδικός είναι υποχρεωτικός",
                                    minLength: {
                                        value: 8,
                                        message: "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες"
                                    }
                                })}
                            />
                            <label htmlFor="new_password">*Νέος Κωδικός</label>
                            {showPassword ? (
                                <IoEye className="toggle-password-icon" onClick={togglePasswordVisibility} size="1.2rem" />
                            ) : (
                                <IoEyeOff className="toggle-password-icon" onClick={togglePasswordVisibility} size="1.2rem" />
                            )}
                            <p className="errors">{errors.new_password?.message}</p>

                        </div>

                        {/* Επιβεβαίωση Νέου Κωδικού */}
                        <div className="form-floating mb-4 position-relative input-container"style={{width: "fit-content"}}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`form-control cu-input ${errors.confirm_password ? 'is-invalid' : ''}`}
                                id="confirm_password"
                                placeholder="Επιβεβαίωση Νέου Κωδικού"
                                {...register("confirm_password", {
                                    required: "Η επιβεβαίωση κωδικού είναι υποχρεωτική",
                                    validate: (value) =>
                                        value === watch('new_password') || "Οι κωδικοί δεν ταιριάζουν"
                                })}
                            />
                            <label htmlFor="confirm_password">*Επιβεβαίωση Νέου Κωδικού</label>
                            {showPassword ? (
                                <IoEye className="toggle-password-icon" onClick={togglePasswordVisibility} size="1.2rem" />
                            ) : (
                                <IoEyeOff className="toggle-password-icon" onClick={togglePasswordVisibility} size="1.2rem" />
                            )}
                            <p className="errors">{errors.confirm_password?.message}</p>

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
        </>
    );
};

export default MySettings;