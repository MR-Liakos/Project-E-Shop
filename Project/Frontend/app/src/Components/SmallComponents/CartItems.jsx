import React, { useState, useEffect } from 'react';
import api from '../../endpoints/api';
import api2, { BASE_URL } from '../../endpoints/api2';
import './CartItems.css';
import { useForm } from "react-hook-form";

const CartItems = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const isLoggedInLocal = localStorage.getItem("loggedIn")
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

        const onSubmit = async (data) => {
            if (isLoading) return;

            clearErrors();
            setIsLoading(true);

            try {
                if (isLoggedInLocal) {
                const response = await api.patch("api/user/update", data);
                // Assume response.data contains updated user info
                setShowSuccessModal(true);
                reset(response.data); // update form with the new data
                setUserData(response.data); // update state
                }
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


    return (
        <div className="cart-items">
            {orders.map(order => (
                <div key={order.id} className="order">
                    {/* Left side: Products */}
                    <div className="products-section">
                        <h3>Order #{order.id}</h3>
                        {order.order_items.map((item, index) => (
                            <div key={`${order.id}-${index}`} className="cart-item">
                                <div className="item-details">
                                    <img
                                        src={item.product.image ? `${BASE_URL}${item.product.image}` : EshopLogo}
                                        className="card-img-top mx-auto d-block order-prod-image"
                                        alt={item.product.name || "Unknown Product"}
                                    />
                                    <div className="item-info">
                                        <h4>{item.product.name}</h4>
                                        <div className="quantity-control">
                                            <label htmlFor={`quantity-${order.id}-${index}`}>Quantity:</label>
                                            <input
                                                id={`quantity-${order.id}-${index}`}
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(
                                                        order.id,
                                                        index,
                                                        parseInt(e.target.value, 10)
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteItem(order.id, item.product.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Right side: Order Info and Update Form */}
                    <div className="info-section">
                        <h2>Product Value: {(order.price - order.price / (1, 24)).toFixed(2)}</h2>
                        <h2>Shipping: Free</h2>
                        <h2>VAT: {(order.price / (1, 24)).toFixed(2)}</h2>
                        <h2>Total: {order.price}</h2>
                        <div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Form Fields */}
                                <div>
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        id="firstName"
                                        defaultValue={userData.first_name}
                                        {...register("firstName", { required: "First name is required" })}
                                    />
                                    {errors.firstName && <p>{errors.firstName.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        id="lastName"
                                        defaultValue={userData.last_name}
                                        {...register("lastName", { required: "Last name is required" })}
                                    />
                                    {errors.lastName && <p>{errors.lastName.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="address">Address</label>
                                    <input
                                        id="address"
                                        defaultValue={userData.address}
                                        {...register("address", { required: "Address is required" })}
                                    />
                                    {errors.address && <p>{errors.address.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        id="phone"
                                        defaultValue={userData.phone}
                                        {...register("phone", { required: "Phone number is required" })}
                                    />
                                    {errors.phone && <p>{errors.phone.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="city">City</label>
                                    <input
                                        id="city"
                                        defaultValue={userData.city}
                                        {...register("city", { required: "City is required" })}
                                    />
                                    {errors.city && <p>{errors.city.message}</p>}
                                </div>
                                <button type="submit">
                                    Proccedd to Payment
                                </button>
                                <div className='saveinfo'>
                                    <input type="checkbox" id='saveinfo' />
                                    <label htmlFor="saveinfo">Save it reeeeee</label>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CartItems;
