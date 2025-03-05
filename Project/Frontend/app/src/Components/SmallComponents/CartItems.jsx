import React, { useState, useEffect } from 'react';
import api from '../../endpoints/api';
import api2, { BASE_URL } from '../../endpoints/api2';
import './CartItems.css';
import { useForm } from "react-hook-form";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Checkout from '../../endpoints/Checkout';
import OrderConfirmation from './OrderConfirmation';
import { useNavigate } from "react-router-dom";
import { DevTool } from '@hookform/devtools'
import { IoIosArrowDown } from "react-icons/io";

const CartItems = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const isLoggedInLocal = localStorage.getItem("loggedIn")
    const [userData, setUserData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm();
    // Fetch initial user data and set form defaults

    useEffect(() => {

        fetchCartItems();
        const fetchUserData = async () => {
            try {
                if (isLoggedInLocal) {
                    const response = await api.get("api/user/");
                    setUserData(response.data);
                    reset(response.data); // set default form values from API
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();

    }, [reset]);

    // Fetch unpaid orders along with product details
    const fetchCartItems = async () => {
        try {
            if (isLoggedInLocal) {
                setIsLoading(true);
                const ordersResponse = await api.get('api/orders/', { params: { paid: false } });
                const productsResponse = await api2.get('products/');
                const ordersData = ordersResponse.data;
                const productsData = productsResponse.data;

                // Create a product lookup map
                const productMap = productsData.reduce((acc, product) => {
                    acc[product.id] = product;
                    return acc;
                }, {});


                // Merge product details into each order item
                const updatedOrders = ordersData.map(order => ({
                    ...order,
                    order_items: order.order_items.map(item => ({
                        ...item,
                        product: productMap[item.product] || {
                            id: item.product,
                            name: item.product_name,
                            slug: "",
                            image: null
                        }
                    }))
                }));

                setOrders(updatedOrders);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        } finally {
            setIsLoading(false);
        }
    };
    // Delete an order item by removing it and patching the order

    const handleDeleteItem = async (orderId, productId) => {
        try {
            await api.delete(`/api/orders/${orderId}/products/${productId}/`);

            // Update local state to remove the deleted item and recalculate price
            setOrders(prevOrders =>
                prevOrders.map(order => {
                    if (order.id === orderId) {
                        const updatedItems = order.order_items.filter(item => item.product.id !== productId);
                        return {
                            ...order,
                            order_items: updatedItems,
                            price: calculateTotalPrice({ ...order, order_items: updatedItems })
                        };
                    }
                    return order;
                })
            );
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    // Update the quantity of an order item and patch the order
    const handleQuantityChange = async (orderId, itemIndex, newQuantity) => {
        try {
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            const updatedItems = order.order_items.map((item, index) =>
                index === itemIndex ? { ...item, quantity: newQuantity } : item
            );
            const requestData = {
                order_items: updatedItems.map(item => ({
                    product: item.product.id,
                    quantity: item.quantity,
                })),
            };

            // Στέλνουμε το PATCH request στο backend για ενημέρωση της παραγγελίας
            await api.patch(`/api/orders/${orderId}/`, requestData);

            // Ενημερώνουμε το τοπικό state με τα νέα δεδομένα και επανυπολογίζουμε το price
            setOrders(prevOrders =>
                prevOrders.map(o => {
                    if (o.id === orderId) {
                        const updatedOrder = { ...o, order_items: updatedItems };
                        return {
                            ...updatedOrder,
                            price: calculateTotalPrice(updatedOrder)
                        };
                    }
                    return o;
                })
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const calculateTotalPrice = (order) => {
        return order.order_items.reduce((sum, item) => {
            const price = parseFloat(item.product.price) || 0;
            return sum + (price * item.quantity);
        }, 0).toFixed(2);
    };
    /*
        if (isLoading) {
            return <p>Loading cart items...</p>;
        }*/

    if (!orders.length) {
        return <p>No unpaid orders.</p>;
    }
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
            // Ενημέρωση στοιχείων χρήστη
            if (isLoggedInLocal) {
                const response = await api.patch("api/user/update", data);
                // Αν χρειάζεται, μπορείς να ενημερώσεις τα userData εδώ
                setUserData(response.data);
                reset(response.data);
            }

            // Ενημέρωση παραγγελίας για αντικαταβολή
            const orderid = data.orderId; // μπορείς να προσθέσεις ένα hidden input για το order id
            const newTotal = (parseFloat(order.price) + 3).toFixed(2);
            const updatedOrderData = {
                price: newTotal,
                paid: true,
                address: data.address,
                PaymentMeth: 'Antikatavolh',
            };
            await api.patch(`/api/orders/${orderid}/`, updatedOrderData);
            navigate("/OrderConfirmation", { state: { orderid } });

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


    return (
        <div className='cart-cont'>
            {orders.map(order => (
                <div key={order.id} className='' >

                    <div className='cart-left-side'>
                        <h3>Η παραγγελία σου</h3>
                        <div className="order-object" >
                            {order.order_items.map((item, index) => (
                                <div key={`${order.id}-${index}`} className="">
                                    <div className="order-object-info" >
                                        <img
                                            src={
                                                item.product.image
                                                    ? `${BASE_URL}${item.product.image}`
                                                    : EshopLogo
                                            }
                                            className="card-img-top mx-auto d-block order-prod-image"
                                            alt={item.product.name || "Unknown Product"}
                                        />
                                        <div className="item-info">
                                            <h4>{item.product.name}</h4>
                                            <div className="custom-select-wrapper">
                                                <select
                                                    id={`quantity-${order.id}-${index}`}
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(
                                                        order.id,
                                                        index,
                                                        parseInt(e.target.value, 10))
                                                    }
                                                    className="form-select"
                                                >
                                                    {[...Array(10)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                                <IoIosArrowDown className="dropdown-arrow" />
                                            </div>
                                        </div>
                                    </div>
                                    {(order.price - order.price / 1.24).toFixed(2)}€
                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDeleteItem(order.id, item.product.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cart-right-side">
                        <div className="payment-section ">
                            <h3>Σύνοψη Παραγγελίας</h3>
                            <div className="payment-info">
                                <div className='payment-info-after'>
                                    <h5 className='total-price'>
                                        <span>Αξία Προϊόντων:</span>
                                        <span>57,99€</span>
                                    </h5>
                                    <h5 className='total-price'>
                                        <span>Μεταφορικά:</span>
                                        <span>0,00€</span>
                                    </h5>
                                </div>
                            </div>

                            <div className='total-payment mt-3 pb-3'>
                                <h5 className='total-price'>
                                    <span>Σύνολο:</span>
                                    <span>57,99€</span>
                                </h5>
                                <button
                                    className='btn btn-moveon mt-1'
                                    onClick={() => navigate("/Cart/Details", {
                                        state: {
                                            orderId: order.id,
                                            totalPrice: order.price
                                        }
                                    })}
                                >
                                    Προχώρησε σε Αγορά
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default CartItems;