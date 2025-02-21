import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools'
import './ContactForm.css'
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlineTextsms } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const ContactForm = () => {
    const form = useForm()
    const { register, control, handleSubmit, formState, clearErrors } = form
    const { errors } = formState;
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
{/*
        console.log(data.email)  // etsi pairno dedomena
        if (isLoading) return

        clearErrors()
        setIsLoading(true);
         MEXRI NA KANEIS TO MODEL GIA TA FORM I OTI EINAI 
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/", data, { withCredentials: true });

            console.log("Success!", response.data);
            setSuccessMessage("Login Successful!");
            localStorage.setItem('authTokens', JSON.stringify(response.data));
            localStorage.setItem("accessToken", response.data.access);// ta apothikeuei local browser
            localStorage.setItem("refreshToken", response.data.refresh);
            const userToken = Cookies.get('access_token');
            console.log("Success!", userToken);

            const timer = setTimeout(() => {
                navigate('/'); // Redirect after 1.5 seconds
            }, 1500);
            return () => clearTimeout(timer);
        }
        catch (error) {
            console.log("Error during Login!", error); // Log the full error object
            console.log("Error response data:", error.response?.data); // Log the response data if it exists
            if (error.response && error.response.data) {
                Object.keys(error.response.data).forEach(field => {
                    const errorMessages = error.response.data[field];
                    if (errorMessages && errorMessages.length > 0) {
                        setError(errorMessages[0]);
                    }
                })
            }
        }
        finally {
            setIsLoading(false)
        }
        */}
    };

    return (
        <>
            <div className="modal show ModalCustom" tabIndex="-1" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content FullModal">
                        <div className='header-title'>
                            <h1 className="modal-title fs-5 d-flex justify-content-center w-100 " id="exampleModalLabel" style={{ paddingBottom: "5px" }}>
                                Επικοινωνήστε Μαζί Μας
                            </h1>
                        </div>
                        <div className="modal-body">
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

                                <div className="modal-footer modalbtn">
                                    <div className="d-flex justify-content-center w-100">
                                        <button type="submit" disabled={isLoading} onClick={handleSubmit} className="btn py-2 btnlogin" >Αποστολή   </button>
                                    </div>
                                </div>
                            </form>
                            <DevTool control={control} />
                        </div>
                        <div className="modal-footer">
                            <div className="d-flex justify-content-center w-100"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactForm