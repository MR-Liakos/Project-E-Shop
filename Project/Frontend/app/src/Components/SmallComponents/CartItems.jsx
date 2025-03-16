import React, { useEffect, useState, useContext } from 'react';
import api from '../../endpoints/api';
import api2, { BASE_URL } from '../../endpoints/api2';
import './CartItems.css';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IoTrashOutline } from "react-icons/io5";
import { CartContext } from './CartContext';

const CartItems = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const isLoggedInLocal = localStorage.getItem("loggedIn")
    const [userData, setUserData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { fetchCartQuantity } = useContext(CartContext);
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
            await fetchCartQuantity();
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
            // console.log(item.product.price, typeof item.product.price);
            const price = parseFloat(item.product.price) || 0;
            //console.log(price);
            return sum + (price * item.quantity);
        }, 0).toFixed(2);
    };

    const formatPrice = (number) => {
        if (!number) return "0,00";
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div className='cart-cont py-5'>
            {orders.map(order => (
                <div key={order.id} className='' >
                    <div className='cart-left-side'>
                        <p className='order-title'>Η παραγγελία σου</p>
                        <div className="order-object" >
                            {order.order_items.map((item, index) => (
                                <div key={`${order.id}-${index}`} className="left-object">
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
                                            <p className='prod-order-name'>{item.product.name}</p>
                                            <div className='quantity-delete-container-desktop'>
                                                <div className="custom-select-wrapper">
                                                    {/* Quantity Input - Desktop */}
                                                    <input
                                                        min="1"
                                                        type="number"
                                                        id={`quantity-${order.id}-${index}`}
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(
                                                            order.id,
                                                            index,
                                                            parseInt(e.target.value, 10))
                                                        }
                                                        className="form-control quantity-input"
                                                    />
                                                </div>
                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDeleteItem(order.id, item.product.id)
                                                    }
                                                >
                                                    <IoTrashOutline className='trash-icon' />
                                                </button>
                                            </div>
                                        </div>
                                        <div className='order-price'>
                                            {formatPrice((item.product.price / 1.24).toFixed(2))}€
                                        </div>
                                    </div>

                                    <div className='quantity-delete-container-mobile'>
                                        <div className="custom-select-wrapper">
                                            <input
                                                type="number"
                                                id={`quantity-${order.id}-${index}`}
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => handleQuantityChange(
                                                    order.id,
                                                    index,
                                                    parseInt(e.target.value, 10)
                                                )}
                                                className="form-control quantity-input"
                                            />
                                        </div>
                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDeleteItem(order.id, item.product.id)
                                            }
                                        >
                                            <IoTrashOutline size={"1.6rem"} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cart-right-side">
                        <div className="payment-section ">
                            <h3>Σύνοψη Παραγγελίας</h3>
                            <div className="payment-info">
                                <div className='payment-info-after'>
                                    <p className='total-price'>
                                        <span>Αξία Προϊόντων:</span>
                                        <span>{formatPrice((order.price / 1.24).toFixed(2))}€</span>                                    </p>
                                    <p className='total-price'>
                                        <span>ΦΠΑ:</span>
                                        <span>{formatPrice((order.price-(order.price / 1.24)).toFixed(2))}€</span>
                                    </p>
                                    <p className='total-price'>
                                        <span>Μεταφορικά:</span>
                                        <span>0,00€</span>
                                    </p>
                                </div>
                            </div>

                            <div className='total-payment mt-3 pb-3'>
                                <p className='total-price'>
                                    <span>Σύνολο:</span>
                                    <span>{formatPrice(order.price)}€</span>                                </p>
                                <div className="btn-moveon-container">
                                    <button
                                        className='btn btn-moveon mt-1'
                                        onClick={() => navigate("/Cart/Details", {
                                            state: {
                                                orderId: order.id,
                                                totalPrice: order.price,
                                                pass: 'true'
                                            }
                                        })}
                                    >
                                        Προχώρησε σε Αγορά
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default CartItems;