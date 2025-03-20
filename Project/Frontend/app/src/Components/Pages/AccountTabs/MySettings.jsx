import React, { useState, useEffect } from "react";
import "./MySettings.css";
import { useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools';
import { IoEye, IoEyeOff, IoCloseCircle } from "react-icons/io5";
import api from "../../../endpoints/api";
import api2 from "../../../endpoints/api2";
import { MdOutlineStarPurple500 } from "react-icons/md";

const MySettings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showSuccessModal2, setshowSuccessModal2] = useState(false);
    const [showSuccessModal3, setshowSuccessModal3] = useState(false);

    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        getValues,
        formState: { errors },
        setError,
        clearErrors
    } = useForm();

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

        if (userData.googlelogin == true) {
            console.log("den mporeis giati eisai me google");

        } else {
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

                setShowSuccessModal(true);
                setTimeout(() => setShowSuccessModal(false), 3000);
                reset({
                    old_password: '',
                    new_password: '',
                    confirm_password: ''
                });
            } catch (error) {
                console.log(error);

                if (error.response?.status === 400 && error.response.data?.password) {
                    setError("old_password", {
                        type: "manual",
                        message: "Ο παλιός κωδικός δεν είναι σωστός"
                    });
                } else if (error.response?.data) {
                    Object.entries(error.response.data).forEach(([field, messages]) => {
                        const clientField =
                            field === 'new_password' ? 'new_password' :
                                field === 'old_password' ? 'old_password' :
                                    'confirm_password';

                        setError(clientField, {
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
            } finally {
                setIsLoading(false);
            }
        }
    };

    const MakePass = async (e) => {

        try {
            await api2.post('/api/password-reset/', { 'email': userData.email });
            setshowSuccessModal3(true);
            //setTimeout(() => setshowSuccessModal3(false), 3000);

            setshowSuccessModal2(true);
            //setTimeout(() => setshowSuccessModal2(false), 3000);
        } catch (err) {
            setError('Προέκυψε κάποιο σφάλμα. Παρακαλώ δοκιμάστε ξανά.');
            console.error('Error requesting password reset:', err);
        }
    };

    const deleteUser = async () => {
        try {
            const response = api.delete(`api/user/${userData.id}/delete/`);
            console.log(response);


            if (response) {
                localStorage.setItem("loggedIn", "false");
                window.location.href = "https://users.it.teithe.gr/~georrets/Eshop/";
                setShowDeleteModal(false);
            } else {
                const errorData = await response.json();
                console.error('Σφάλμα:', errorData.error);
            }
        } catch (error) {
            console.error('Σφάλμα κατά την επικοινωνία με το API:', error);
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

    if (userData.has_usable_password == false) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Εχετε συνδεθει με Google η ο κωδικοσ σασ ασφαλειασ εχει θεμα</h2>

                    <p>pata to koumpi gia na oriseis pass adelfe</p>
                    <button onClick={MakePass}>
                        edvv
                    </button>
                </div>
                {showSuccessModal2 && (
                    <div className="success-message c-success visible">
                        <p>🎉 To email για Επαναφορά κωδικού έχει σταλεί με Επιτυχία</p>
                    </div>
                )}
                <button
                    type="button"
                    className="delete-account-button"
                    onClick={() => setShowDeleteModal(true)}
                >
                    Διαγραφή Λογαριασμού
                </button>


                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="delete-modal-overlay">
                        <div className="delete-modal">
                            <h5>Επιβεβαίωση Διαγραφής</h5>
                            <p>Είστε σίγουροι ότι θέλετε να διαγράψετε τον λογαριασμό σας; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.</p>
                            <div className="modal-buttons">
                                <button
                                    className="confirm-delete-button"
                                    onClick={() => deleteUser()}
                                >
                                    Διαγραφή
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Ακύρωση
                                </button>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="tab-account-content">
                <div className="settings-content">
                    <h2 className="settings-title text-center">Οι Ρυθμίσεις μου</h2>
                    <form id='formdata' className="form-container" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <h5 className="form-title text-center">Αλλαγή Κωδικού Πρόσβασης</h5>

                        {/* Παλιός Κωδικός */}
                        <div className="form-group mb-4 groups">
                            <label className="input-label">*Παλιός Κωδικός</label>
                            <div className="input-container">
                                <input
                                    type={showPasswords.old ? "text" : "password"}
                                    className={`form-control  input-field ${errors.old_password ? 'error-border' : ''}`}
                                    {...register("old_password", {
                                        required: "Παρακαλώ εισάγετε τον τρέχοντα κωδικό"
                                    })}
                                    autoComplete="off"
                                />
                                <div className="password-toggle-icon">
                                    {showPasswords.old ? (
                                        <IoEye onClick={() => setShowPasswords(p => ({ ...p, old: false }))} />
                                    ) : (
                                        <IoEyeOff onClick={() => setShowPasswords(p => ({ ...p, old: true }))} />
                                    )}
                                </div>
                            </div>
                            {errors.old_password && (
                                <div className="error-list">
                                    <div className="error-item">
                                        <IoCloseCircle className="error-icon" />
                                        <span>{errors.old_password.message}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Νέος Κωδικός */}
                        <div className="form-group mb-4 groups">
                            <label className="input-label">*Νέος Κωδικός</label>
                            <div className="input-container">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    className={`form-control  input-field ${errors.new_password ? 'error-border' : ''}`}
                                    {...register("new_password", {
                                        required: "Παρακαλώ εισάγετε νέο κωδικό",
                                        minLength: {
                                            value: 8,
                                            message: "Πρέπει να περιέχει τουλάχιστον 8 χαρακτήρες"
                                        },
                                        validate: (value) => {
                                            const oldPassword = getValues("old_password");
                                            if (!oldPassword) return true;
                                            return value !== oldPassword || "Ο νέος κωδικός δεν πρέπει να είναι ίδιος με τον παλιό";
                                        }
                                    })}
                                    autoComplete="new-password"
                                />
                                <div className="password-toggle-icon">
                                    {showPasswords.new ? (
                                        <IoEye onClick={() => setShowPasswords(p => ({ ...p, new: false }))} />
                                    ) : (
                                        <IoEyeOff onClick={() => setShowPasswords(p => ({ ...p, new: true }))} />
                                    )}
                                </div>
                            </div>
                            {errors.new_password && (
                                <div className="error-list">
                                    <div className="error-item">
                                        <IoCloseCircle className="error-icon" />
                                        <span>{errors.new_password.message}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Επιβεβαίωση Κωδικού */}
                        <div className="form-group mb-4 groups">
                            <label className="input-label">*Επιβεβαίωση Νέου Κωδικού</label>
                            <div className="input-container">
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    className={`form-control input-field ${errors.confirm_password ? 'error-border' : ''}`}
                                    {...register("confirm_password", {
                                        required: "Η επιβεβαίωση κωδικού είναι υποχρεωτική",
                                        validate: value =>
                                            value === getValues("new_password") || "Οι κωδικοί δεν ταιριάζουν"
                                    })}
                                    autoComplete="off"
                                />
                                <div className="password-toggle-icon">
                                    {showPasswords.confirm ? (
                                        <IoEye onClick={() => setShowPasswords(p => ({ ...p, confirm: false }))} />
                                    ) : (
                                        <IoEyeOff onClick={() => setShowPasswords(p => ({ ...p, confirm: true }))} />
                                    )}
                                </div>
                            </div>
                            {errors.confirm_password && (
                                <div className="error-list">
                                    <div className="error-item">
                                        <IoCloseCircle className="error-icon" />
                                        <span>{errors.confirm_password.message}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="form-footer">
                            <button
                                type="submit"
                                className="submit-button"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Αποθήκευση...
                                    </>
                                ) : (
                                    "Αποθήκευση Αλλαγών"
                                )}
                            </button>
                            <button
                                type="button"
                                className="delete-account-button"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                Διαγραφή Λογαριασμού
                            </button>
                            <button
                                type="button"
                                className="refresh-account-button"
                                onClick={() => MakePass()}
                            >
                                Επαναφορά Κωδικού Πρόσβασης
                            </button>
                        </div>

                        {/* Delete Confirmation Modal */}
                        {showDeleteModal && (
                            <div className="delete-modal-overlay">
                                <div className="delete-modal">
                                    <h5>Επιβεβαίωση Διαγραφής</h5>
                                    <p>Είστε σίγουροι ότι θέλετε να διαγράψετε τον λογαριασμό σας; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.</p>
                                    <div className="modal-buttons">
                                        <button
                                            className="cancel-button"
                                            onClick={() => setShowDeleteModal(false)}
                                        >
                                            Ακύρωση
                                        </button>
                                        <button
                                            className="confirm-delete-button"
                                            onClick={() => deleteUser()}
                                        >
                                            Διαγραφή
                                        </button>
                                    </div>
                                </div>
                            </div>

                        )}

                    </form >
                    {/* <DevTool control={control} /> */}

                    {/* Success Modal */}
                    {showSuccessModal && (
                        <div className="success-message visible">
                            <MdOutlineStarPurple500 className="success-icon" />
                            <p>
                                🎉 Επιτυχία!
                            </p>
                        </div>
                    )
                    }
                    {showSuccessModal3 && (

                        <div className="success-message visible">
                            <MdOutlineStarPurple500 className="success-icon" />
                            <p>🎉 To email για Επαναφορά κωδικού έχει σταλεί με Επιτυχία</p>
                        </div>
                    )
                    }

                </div >
            </div >
        </>
    );
};

export default MySettings;