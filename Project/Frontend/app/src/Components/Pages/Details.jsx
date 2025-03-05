import React, { useState, useEffect } from 'react';
import api from '../../endpoints/api';
import CartItems from '../SmallComponents/CartItems';
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import './Details.css';
import { useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Checkout from '../../endpoints/Checkout';

const Details = () => {
    const { state } = useLocation();
    const { orderId, totalPrice } = state || {};
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const isLoggedInLocal = localStorage.getItem("loggedIn");

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm();

    // Fetch τα στοιχεία του χρήστη, αν έχει γίνει login
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (isLoggedInLocal) {
                    const response = await api.get("api/user/");
                    setUserData(response.data);
                    reset({
                        ...response.data,
                        orderId: orderId // Προσθήκη orderId στο form
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (isLoggedInLocal && orderId) {
            fetchUserData();
        }
    }, [isLoggedInLocal, orderId, reset]);

    // Fetch των στοιχείων της παραγγελίας βάσει του orderId
    useEffect(() => {
        const fetchOrderData = async () => {
            if (!orderId) return;
            try {
                setIsLoading(true);
                const response = await api.get(`/api/orders/${orderId}/`);
                // Αν θέλεις να δουλέψεις με map, βάζουμε τα δεδομένα σε πίνακα:
                setOrders([response.data]);
            } catch (error) {
                console.error("Error fetching order data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderData();
    }, [orderId]);

    const initialOptions = {
        "client-id": "ASSTKc3R-o04rG1xL3126oy9P19oWd3bLO8b4lPOsb0O1umCl1R7Gt8LHtGleXNnbccV046ptZlRg8dQ",
        currency: "EUR",
        intent: "capture",
    };

    const onSubmit = async (data) => {
        if (isLoading) return;
        clearErrors();
        setIsLoading(true);

        try {
            if (isLoggedInLocal) {
                await api.patch("api/user/update", data);
            }
            const updatedOrderData = {
                price: totalPrice,
                paid: true,
                address: data.address,
                PaymentMeth: 'Antikatavolh',
                documentType: data.documentType
            };
            await api.patch(`/api/orders/${orderId}/`, updatedOrderData);
            navigate("/OrderConfirmation", { state: { orderId } });
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
        } finally {
            setIsLoading(false);
        }
    };

    // Ελέγχουμε αν υπάρχουν παραγγελίες για να εμφανίσουμε το checkout
    const hasOrders = orders && orders.length > 0;

    return (
        <>
            <TopNavbar />
            <Navbar />
            <div className="home-container">
                {hasOrders ? (
                    <div className="checkout-page mt-5">
                        <div className='checkout-left'>
                            <div className="btn-return" onClick={() => navigate("/Cart")}>
                                <IoIosArrowRoundBack className="back-icon" />
                                <span className="return-link">Επιστροφή</span>
                            </div>
                            <h2 className="mb-4">Στοιχεία Παράδοσης</h2>
                            <form onSubmit={handleSubmit(onSubmit)} noValidate className="checkout-form">
                                {/* Όνομα */}
                                <div className='row'>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="firstName" className="form-label">Όνομα</label>
                                        <input
                                            id="firstName"
                                            {...register("first_name", {
                                                required: "Το όνομα είναι υποχρεωτικό"
                                            })}
                                            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                        />
                                        {errors.first_name &&
                                            <div className="errors">{errors.first_name.message}</div>}
                                    </div>
                                    {/* Επίθετο */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="lastName" className="form-label">Επίθετο</label>
                                        <input
                                            id="lastName"
                                            {...register("last_name", {
                                                required: "Το επίθετο είναι υποχρεωτικό"
                                            })}
                                            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                        />
                                        {errors.last_name &&
                                            <div className="errors">{errors.last_name.message}</div>}
                                    </div>
                                </div>

                                <div className='row'>
                                    {/* Πόλη */}
                                    <div className="col-md-8 mb-3">
                                        <label htmlFor="city" className="form-label">Πόλη</label>
                                        <input
                                            id="city"
                                            {...register("city", {
                                                required: "Η πόλη είναι υποχρεωτική"
                                            })}
                                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                        />
                                        {errors.city &&
                                            <div className="errors">{errors.city.message}</div>}
                                    </div>
                                    {/* Τ.Κ. */}
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="postalCode" className="form-label">Τ.Κ.</label>
                                        <input
                                            id="postalCode"
                                            {...register("postalCode", {
                                                required: "Το Τ.Κ. είναι υποχρεωτικό"
                                            })}
                                            className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                                        />
                                        {errors.postalCode &&
                                            <div className="errors">{errors.postalCode.message}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Διεύθυνση */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="address" className="form-label">Διεύθυνση</label>
                                        <input
                                            id="address"
                                            {...register("address", {
                                                required: "Η διεύθυνση είναι υποχρεωτική"
                                            })}
                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        />
                                        {errors.address &&
                                            <div className="errors">{errors.address.message}</div>}
                                    </div>
                                    {/* Τηλέφωνο */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="phone" className="form-label">Τηλέφωνο</label>
                                        <input
                                            id="phone"
                                            {...register("phone", {
                                                required: "Το τηλέφωνο είναι υποχρεωτικό",
                                                pattern: {
                                                    value: /^69\d{8}$/,
                                                    message: "Μη έγκυρο τηλέφωνο (π.χ. 69xxxxxxxx)"
                                                }
                                            })}
                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        />
                                        {errors.phone && (
                                            <div className="errors">{errors.phone.message}</div>
                                        )}
                                    </div>
                                </div>
                            </form>
                            <DevTool control={control} />
                        </div>

                        <div className='checkout-right'>
                            {orders.map(order => (
                                <div key={order.id}>
                                    <div className='complete-order my-4'>
                                        <div className='text-order text-start'>
                                            <p className='top-text'>
                                                Εκτιμώμενη Παράδωση
                                            </p>
                                            <p className='bot-text'>
                                                Από 3-7 ημέρες
                                            </p>
                                            <p className='top-text'>
                                                Προς..
                                            </p>
                                            <p className='bot-text'>
                                                Διεύθυνση, Θεσσαλονίκη
                                            </p>
                                            <div className="order-det" style={{borderTop: "1px solid rgb(211, 211, 211)"}}>
                                                {/*onoma proiontos*/}
                                                <span>ordername</span>
                                                <span>quantityX</span>
                                                <span>95.99{/*price*/}</span>
                                            </div>
                                            <h5 className='order-det'>
                                                <span>Μεταφορικά:</span>
                                                <span>0,00€</span>
                                            </h5>
                                            <h5 className='order-det'>
                                                <span>Σύνολο:</span>
                                                <span>57,99€</span>
                                            </h5>
                                            <p className='text-fpa'>Στις τιμές συμπεριλαμβάνεται Φ.Π.Α.</p>
                                        </div>
                                        <button
                                            className="btn payment-btn mt-3"
                                            type="button"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target={`#offcanvasPayment-${order.id}`}
                                            aria-controls={`offcanvasPayment-${order.id}`}
                                        >
                                            Στοιχεία Πληρωμής
                                        </button>
                                    </div>

                                    {/* Offcanvas component */}
                                    <div
                                        className="offcanvas offcanvas-end"
                                        tabIndex="-1"
                                        id={`offcanvasPayment-${order.id}`}
                                        aria-labelledby={`offcanvasPaymentLabel-${order.id}`}
                                    >
                                        <div className="offcanvas-header">
                                            <h5 className="offcanvas-title" id={`offcanvasPaymentLabel-${order.id}`}>
                                                Τρόποι Πληρωμής
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="offcanvas"
                                                aria-label="Close"
                                            ></button>
                                        </div>

                                        <div className="offcanvas-body">
                                            <PayPalScriptProvider options={initialOptions}>
                                                <Checkout
                                                    price={order.price}
                                                    id={order.id}
                                                    address={userData?.address}
                                                />
                                            </PayPalScriptProvider>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <CartItems />
                )}
                <Footer />
            </div>
        </>
    );
};

export default Details;
