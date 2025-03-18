import React, { useEffect, useState, useContext } from 'react';
import api from '../../endpoints/api';
import CartItems from '../SmallComponents/CartItems';
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import './Details.css';
import { set, useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { IoIosLock } from "react-icons/io";
import Checkout from '../../endpoints/Checkout';
import api2 from '../../endpoints/api2';
import { CartContext } from '../SmallComponents/CartContext';

const Details = () => {
    const { state } = useLocation();
    const { orderId, totalPrice, pass } = state || {};
    const [userData, setUserData] = useState();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const isLoggedInLocal = localStorage.getItem("loggedIn");
    const [products, setproducts] = useState([]);
    const [test, settest] = useState(true);
    const [Antikatavolh, setAntikatavoli] = useState(false);
    const [Paypal, setPaypal] = useState(false);
    const [formError, setFormError] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [showPaymentButton, setShowPaymentButton] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);
    const { updateCartQuantity } = useContext(CartContext);

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isValid },
        setError,
        trigger,
        clearErrors,
    } = useForm({
        mode: 'onChange'
    });
    const city = watch("city");
    const address = watch("address");

    const handleFinalPayment = async () => {
        // Ενεργοποίηση της επικύρωσης για όλα τα πεδία
        const isValid = await trigger();
        if (!isValid) {
            setFormError('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία');
            return;
        }
        setFormError('');
        setIsFormValid(true);

        // Έλεγχος επιλογής τρόπου πληρωμής
        if (!selectedPayment) {
            setPaymentError('Παρακαλώ επιλέξτε τρόπο πληρωμής');
            return;
        }
        setPaymentError('');

        // Εκτέλεση ανάλογα με την επιλογή πληρωμής
        if (selectedPayment === 'cod') {
            // Χρήση του handleSubmit για να εμφανιστούν τα field-level errors εάν υπάρχουν
            handleSubmit(onSubmit)();
        } else if (selectedPayment === 'paypal') {
            // Ενεργοποίηση της πληρωμής μέσω PayPal με το κλικ στο κρυφό κουμπί
            document.querySelector('.paypal-button').click();
        }
    };


    // Fetch τα στοιχεία του χρήστη, αν έχει γίνει login
    useEffect(() => {
        const fetchData = async () => {
            if (!orderId) return;
            try {
                setIsLoading(true);
                const orderRequest = api.get(`/api/orders/${orderId}/`);
                const userRequest = isLoggedInLocal ? api.get("api/user/") : null;
                const productsRequest = api2.get('products/')

                const [orderResponse, userResponse, productsResponse] = await Promise.all([
                    orderRequest,
                    userRequest ? userRequest : Promise.resolve(null),
                    productsRequest ? productsRequest : Promise.resolve(null),
                ]);
                // Update state separately

                setproducts(productsResponse.data)
                setOrders([orderResponse.data]);
                if (orderResponse.data.order_items.length == 0) {
                    settest(false)

                } else {
                    settest(true)
                }


                if (userResponse) {
                    setUserData(userResponse.data);
                    reset({
                        ...userResponse.data,
                        orderId: orderId
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isLoggedInLocal, orderId, reset]);



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
            // Ενημέρωση του stock για κάθε προϊόν στην παραγγελία
            for (const item of orders[0].order_items) {
                await api2.patch(`/update-stock/${item.product}/`, {
                    quantity: item.quantity
                });
            }
            const updatedOrderData = {
                price: totalPrice,
                paid: true,
                address: data.address,
                PaymentMeth: 'Antikatavolh',
                documentType: data.documentType
            };
            await updateCartQuantity("");

            await api.patch(`/api/orders/${orderId}/`, updatedOrderData);
            await api.get(`/api/ordersemail/${orderId}/`);
            
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

    const tocart = () => {
        navigate('/cart')
    }

    const [selectedPayment, setSelectedPayment] = useState('');

    const handlePaymentMethodChange = (e) => {
        const method = e.target.value;
        setSelectedPayment(method);
        clearErrors();
        if (method === 'cod') {
            setAntikatavoli(true);
            setPaypal(false);
            setPaymentError(''); // clear error when changing option
            setShowPaymentButton(true); // Show button when COD is selected
        } else if (method === 'paypal') {
            setAntikatavoli(false);
            setPaypal(true);
            setPaymentError(''); // clear error when changing option
            setShowPaymentButton(false); // Hide button when PayPal is selected
        }
    };


    const clearSelection = () => {
        setSelectedPayment('');
        setAntikatavoli(false);
        setPaypal(false);
        setShowPaymentButton(true); // Hide button when selection is cleared
        clearErrors();
        setFormError('');
        setPaymentError('');
    };

    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Calculate the halfway point of the initial visible page height
            const initialPageHeight = window.innerHeight;

            const twentyPercentPoint = initialPageHeight * 0.20; // 20%

            // Get the current scroll position
            const scrollPosition = window.scrollY;

            // Check if the scroll position is past the halfway point
            if (scrollPosition > twentyPercentPoint) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        // Add the scroll event listener
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Remove the listener when the component unmounts
        return () => {
            window.removeEventListener("scroll", handleScroll, { passive: true });
        };
    }, []);
    return (
        <>
            <div className={`navbar-full-container ${isSticky ? 'sticky' : ''}`}>
                <TopNavbar />
                <Navbar />
            </div>
            <div className="home-container">
                {(pass && test) ? (
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
                                            {...register("first_name", { required: "Το όνομα είναι υποχρεωτικό" })}
                                            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                        />
                                        {errors.first_name && (
                                            <div className="errors">{errors.first_name.message}</div> // Αλλαγή εδώ
                                        )}
                                    </div>
                                    {/* Επίθετο */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="lastName" className="form-label">Επίθετο</label>
                                        <input
                                            id="lastName"
                                            {...register("last_name", { required: "Το επίθετο είναι υποχρεωτικό" })}
                                            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                        />
                                        {errors.last_name && (
                                            <div className="errors">{errors.last_name.message}</div> // Αλλαγή εδώ
                                        )}
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
                                        {errors.city && (
                                            <div className="errors">{errors.city.message}</div>)}
                                    </div>
                                    {/* Τ.Κ. */}
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="postalCode" className="form-label">Τ.Κ.</label>
                                        <input
                                            id="postalCode"
                                            {...register("postalCode", {
                                                required: "Ο Τ.Κ. είναι υποχρεωτικός",
                                                pattern: {
                                                    value: /^\d{5}$/,
                                                    message: "Ο Τ.Κ. πρέπει να αποτελείται από 5 ψηφία"
                                                }
                                            })}
                                            type="number"
                                            className={`form-control no-spinner ${errors.postalCode ? 'is-invalid' : ''}`} // Προσθήκη space πριν το ${
                                        />
                                        {errors.postalCode && (
                                            <div className="errors">{errors.postalCode.message}</div> // Αλλαγή εδώ
                                        )}
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
                                        {errors.address && (
                                            <div className="errors">{errors.address.message}</div>)}
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
                                            <div className="errors ">{errors.phone.message}</div> // Αλλαγή εδώ
                                        )}
                                    </div>
                                </div>
                            </form>
                            <DevTool control={control} />
                        </div>

                        <div className='checkout-right'>
                            {orders.map(order => (
                                <div key={order.id} className=''>

                                    <div className='complete-order my-4'>
                                        <div className='text-order text-start'>

                                            <div style={{ borderBottom: "1px solid rgb(211, 211, 211)" }}>
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
                                                    {address}, {city}
                                                </p>
                                            </div>
                                            {order.order_items.map((item, index) => (
                                                <div key={`${order.id}-${index}`} className="">
                                                    <div className="order-det" >
                                                        {/*onoma proiontos*/}
                                                        <span className='prod-item-onomasia'>{products.find(p => p.id === item.product)?.name}</span>
                                                        <span>{item.quantity}x{products.find(p => p.id === item.product)?.price}€</span>
                                                        <span>{products.find(p => p.id === item.product)?.price * item.quantity}€</span>
                                                    </div>
                                                </div>
                                            ))}

                                            <h5 className='order-det'>
                                                <span>Μεταφορικά:</span>
                                                <span>0,00€</span>
                                            </h5>

                                            {Antikatavolh && (
                                                <h5 className='order-det'>
                                                    <span >
                                                        Αντικαταβολή:
                                                    </span>
                                                    <span>
                                                        3,00€
                                                    </span>
                                                </h5>
                                            )}
                                            <h5 className='order-det'>
                                                <span>Σύνολο:</span>
                                                <span>
                                                    {Antikatavolh ?
                                                        (parseFloat(order.price) + 3).toFixed(2)
                                                        :
                                                        order.price
                                                    }€
                                                </span>
                                            </h5>
                                            <p className='text-fpa'>Στις τιμές συμπεριλαμβάνεται Φ.Π.Α.</p>
                                        </div>
                                        <div className="payment-options">
                                            <p>Επιλογή Τρόπου Πληρωμής</p>

                                            <div className="d-flex flex-column mb-3">
                                                <label className={`mb-1 ${!isValid ? 'disabled-label' : ''}`}>
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value="paypal"
                                                        checked={selectedPayment === 'paypal'}
                                                        onChange={handlePaymentMethodChange}
                                                        disabled={!isValid} // Disable if form is not filled
                                                    />
                                                    <span className="ms-2">PayPal / Χρεωστική ή Πιστωτική</span>
                                                </label>
                                                <label className={`${!isValid ? 'disabled-label' : ''}`}>
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value="cod"
                                                        checked={selectedPayment === 'cod'}
                                                        onChange={handlePaymentMethodChange}
                                                        disabled={!isValid} // Disable if form is not filled
                                                    />
                                                    <span className="ms-2">Αντικαταβολή (+3,00€)</span>
                                                </label>
                                            </div>

                                            {selectedPayment && (
                                                <button className="btn btn-secondary mb-3" onClick={clearSelection}>
                                                    Καθαρισμός Επιλογής
                                                </button>
                                            )}

                                            {selectedPayment === 'cod' && (
                                                <div className="payment-details">
                                                    <p>Η παραγγελία θα πληρωθεί κατά την παράδοση.</p>
                                                </div>
                                            )}
                                            {formError && <div className="alert alert-danger mt-2">{formError}</div>}
                                            {paymentError && <div className="alert alert-danger mt-2">{paymentError}</div>}

                                        </div>
                                        {selectedPayment === 'paypal' && (
                                            <div className='payment-btn-container' >
                                                <PayPalScriptProvider options={initialOptions}>
                                                    <Checkout
                                                        price={totalPrice}
                                                        id={orderId}
                                                        address={userData?.address}
                                                        className="paypal-button"
                                                        style={{ display: 'none' }}
                                                    />
                                                </PayPalScriptProvider>
                                            </div>
                                        )}
                                        {/* Conditionally render the payment button */}
                                        {showPaymentButton && (
                                            <div className='payment-btn-container'>
                                                <button
                                                    className="btn payment-btn mt-3"
                                                    type="button"
                                                    onClick={handleFinalPayment}
                                                >
                                                    <IoIosLock className='locker-icon' />
                                                    Ολοκλήρωση
                                                </button>
                                            </div>

                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    tocart()
                )}
                <Footer />
            </div>
        </>
    );
};

export default Details;
