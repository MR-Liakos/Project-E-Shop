import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools'
import './ContactForm.css'
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlineTextsms } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import api from '../../endpoints/api';
import { MdOutlineStarPurple500 } from "react-icons/md";

const ContactForm = () => {
    const form = useForm()
    const { register, control, handleSubmit, formState, clearErrors } = form
    const { errors } = formState;
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setshowSuccessModal] = useState(false);

    const onSubmit = async (data) => {
        
        if (isLoading) return

        clearErrors()
        setIsLoading(true);

        try {
            await api.post("/api/Contactmessages/", data, { withCredentials: true });
            setshowSuccessModal(true);
            setTimeout(() => {
                setshowSuccessModal(false); // Hide the success message after 3 seconds
                window.location.href = "https://users.it.teithe.gr/~georrets/Eshop/Contact"; // Redirect the user
              }, 3000);
        }
        catch (error) {
            console.log("Error response data:", error.response?.data); // Log the response data if it exists

        }

    };

    return (
        <>
            <div className='contact-container'>
                <div className='header-title'>
                    <h1 className=" ">
                        Επικοινωνήστε Μαζί Μας
                    </h1>
                </div>
                <div className="contact-body">
                    <form id='formLogin' onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="form-floating mb-4 mt-4 position-relative">
                            <input
                                type="text"
                                className="form-control contact-input"
                                id="name"
                                placeholder="Όνομα"
                                name="name"
                                {...register("name", {
                                    required: {
                                        value: true,
                                        message: "Το όνομα είναι υποχρεωτικό",
                                    }
                                })}
                            />
                            <p className="errors">{errors.name?.message}</p>
                            <label htmlFor="name">*Όνομα </label>
                            <MdDriveFileRenameOutline
                                className='email-icon'
                                size={"1.4rem"}
                            />
                        </div>

                        <div className="form-floating mb-4 mt-4 position-relative">
                            <input
                                type="email"
                                className="form-control contact-input"
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

                            <MdOutlineMailOutline
                                className='email-icon'
                                size={"1.4rem"}
                            />
                        </div>

                        <div className="form-floating mb-4 mt-4 position-relative">
                            <textarea
                                className="form-control c-textarea"
                                id="message"
                                placeholder="Μήνυμα"
                                name="message"
                                rows="5"  // Ορίζει σταθερό αριθμό γραμμών
                                style={{
                                    resize: 'none', // Απενεργοποιεί το resizing
                                    overflow: 'hidden', // Αποκρύπτει το scrollbar
                                    minHeight: '120px', // Ελάχιστο ύψος
                                    maxHeight: '120px' // Μέγιστο ύψος (προαιρετικό)
                                }}
                                {...register("message", {
                                    required: {
                                        value: true,
                                        message: "Το πεδίο μήνυμα είναι υποχρεωτικό",
                                    }
                                })}
                                onWheel={(e) => e.preventDefault()} // Απενεργοποιεί scroll με τροχό
                            />
                            <p className="errors">{errors.message?.message}</p>
                            <label htmlFor="message">*Το Μήνυμα σας</label>
                            <MdOutlineTextsms
                                className='email-icon'
                                size={"1.4rem"}
                            />
                        </div>

                        <div className="btn-contact-container">
                            <button type="submit" disabled={isLoading} onClick={handleSubmit} className="btn  contact-btn" >Αποστολή</button>
                        </div>
                    </form>
                    <DevTool control={control} />
                </div>
                {showSuccessModal && (
                    <div className="success-message visible">
                        <MdOutlineStarPurple500 className="success-icon" />
                        🎉 Το προϊόν προστέθηκε επιτυχώς στο καλάθι σας!
                    </div>
                )}
            </div>
        </>
    )
}

export default ContactForm