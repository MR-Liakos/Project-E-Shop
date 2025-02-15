import React, { useState, useEffect } from "react";
import "./MySettings.css";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools';
import { IoEye, IoEyeOff } from "react-icons/io5";
import api from "../../../endpoints/api";

const MySettings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [userData, setUserData] = useState(null);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const { control, register, handleSubmit, watch, reset, formState: { errors }, setError, clearErrors } = useForm();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get("api/user/");
                setUserData(response.data);
                reset(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, [reset]);

    const onSubmit = async (data) => {
        if (isLoading) return;
        
        clearErrors();
        setIsLoading(true);

        try {
            // Verify old password
            await api.post('api/verify-password/', {
                password: data.old_password
            });

            // Change password
            await api.patch("api/user/update", {
                old_password: data.old_password,
                new_password: data.new_password
            });

            setSuccessMessage("Ο κωδικός ενημερώθηκε επιτυχώς!");
            setShowSuccessModal(true);
            reset({
                old_password: '',
                new_password: '',
                confirm_password: ''
            });
        } catch (error) {
            if (error.response?.status === 400 && error.response.data?.password) {
                setError("old_password", {
                    type: "manual",
                    message: "Ο παλιός κωδικός δεν είναι σωστός"
                });
            } else if (error.response?.data) {
                Object.entries(error.response.data).forEach(([field, messages]) => {
                    setError(field, {
                        type: "server",
                        message: Array.isArray(messages) ? messages[0] : messages
                    });
                });
            } else {
                setError("root", {
                    type: "manual",
                    message: "Σφάλμα δικτύου ή διακομιστή"
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

                        <h5 className="h5-tags">Αλλαγή Κωδικού Πρόσβασης</h5>
                        
                        {/* Παλιός Κωδικός */}
                        <div className="form-floating mb-4 input-container cu-input">
                            <input
                                type={showPasswords.old ? "text" : "password"}
                                className={`form-control  ${errors.old_password ? 'is-invalid' : ''}`}
                                id="old_password"
                                placeholder="Παλιός Κωδικός"
                                {...register("old_password", {
                                    required: "Παρακαλώ εισάγετε τον τρέχοντα κωδικό"
                                })}
                            />
                            <label htmlFor="old_password">*Παλιός Κωδικός</label>
                            {showPasswords.old ? (
                                <IoEye className="toggle-password-icon" onClick={() => setShowPasswords(p => ({...p, old: false}))} />
                            ) : (
                                <IoEyeOff className="toggle-password-icon" onClick={() => setShowPasswords(p => ({...p, old: true}))} />
                            )}
                            {errors.old_password && <p className="text-danger mt-1">{errors.old_password.message}</p>}
                        </div>

                        {/* Νέος Κωδικός */}
                        <div className="form-floating mb-4 position-relative input-container cu-input">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                                id="new_password"
                                placeholder="Νέος Κωδικός"
                                {...register("new_password", {
                                    required: "Παρακαλώ εισάγετε νέο κωδικό",
                                    minLength: {
                                        value: 8,
                                        message: "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες"
                                    },
                                   /* pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                        message: "Πρέπει να περιέχει τουλάχιστον 1 κεφαλαίο, 1 πεζό και 1 αριθμό"
                                    }*/
                                })}
                            />
                            <label htmlFor="new_password">*Νέος Κωδικός</label>
                            {showPasswords.new ? (
                                <IoEye className="toggle-password-icon" onClick={() => setShowPasswords(p => ({...p, new: false}))} />
                            ) : (
                                <IoEyeOff className="toggle-password-icon" onClick={() => setShowPasswords(p => ({...p, new: true}))} />
                            )}
                            {errors.new_password && <p className="text-danger mt-1">{errors.new_password.message}</p>}
                        </div>

                        {/* Επιβεβαίωση Νέου Κωδικού */}
                        <div className="form-floating mb-4 position-relative input-container  cu-input">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                className={`form-control  ${errors.confirm_password ? 'is-invalid' : ''}`}
                                id="confirm_password"
                                placeholder="Επιβεβαίωση Νέου Κωδικού"
                                {...register("confirm_password", {
                                    required: "Η επιβεβαίωση κωδικού είναι υποχρεωτική",
                                    validate: value =>
                                        value === watch('new_password') || "Οι κωδικοί δεν ταιριάζουν"
                                })}
                            />
                            <label htmlFor="confirm_password">*Επιβεβαίωση Νέου Κωδικού</label>
                            {showPasswords.confirm ? (
                                <IoEye className="toggle-password-icon" onClick={() => setShowPasswords(p => ({...p, confirm: false}))} />
                            ) : (
                                <IoEyeOff className="toggle-password-icon" onClick={() => setShowPasswords(p => ({...p, confirm: true}))} />
                            )}
                            {errors.confirm_password && <p className="text-danger mt-1">{errors.confirm_password.message}</p>}
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
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
                                    <div className="modal-header bg-success text-white">
                                        <h5 className="modal-title">Επιτυχία!</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowSuccessModal(false)}
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        {successMessage}
                                        <div className="mt-3 text-end">
                                            <button 
                                                className="btn btn-success"
                                                onClick={() => setShowSuccessModal(false)}
                                            >
                                                Κλείσιμο
                                            </button>
                                        </div>
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