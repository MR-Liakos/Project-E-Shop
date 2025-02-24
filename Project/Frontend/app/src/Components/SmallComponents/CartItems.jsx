import React, { useState, useEffect } from 'react';
import api from '../../endpoints/api';
import api2, { BASE_URL } from '../../endpoints/api2';
import './CartItems.css';

const CartItems = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    // Fetch unpaid orders along with product details
    const fetchCartItems = async () => {
        try {
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
        } catch (error) {
            console.error("Error fetching cart items:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    // Helper to format order items as required by the API:
    // { order_items: [{ product: productId, quantity: number }, ...] }
    const formatOrderItems = (items) => {
        return items.map(item => ({
            product: item.product.id,
            quantity: item.quantity,
        }));
    };

    // Delete an order item by removing it and patching the order
    const handleDeleteItem = async (orderId, productId) => {
        try {
            await api.delete(`/api/orders/${orderId}/products/${productId}/`);

            // Update local state to remove the deleted item
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, order_items: order.order_items.filter(item => item.product.id !== productId) }
                        : order
                )
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

            // Ενημερώνουμε το τοπικό state με τα νέα δεδομένα
            setOrders(prevOrders =>
                prevOrders.map(o => (o.id === orderId ? { ...o, order_items: updatedItems } : o))
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    if (isLoading) {
        return <p>Loading cart items...</p>;
    }

    if (!orders.length) {
        return <p>No unpaid orders.</p>;
    }

    return (
        <div className="cart-items">
            {orders.map(order => (
                <div key={order.id} className="order">

                    {order.order_items.map((item, index) => (
                        <div key={`${order.id}-${index}`} className="cart-item">
                            <h3>Order #{order.id}</h3>
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
                                                    index, // Χρήση index αντί για item.id
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
            ))}
        </div>
    );
};

export default CartItems;
