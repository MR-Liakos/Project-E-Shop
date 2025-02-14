import React, { useState, useEffect } from 'react';
import api from '../../../endpoints/api';
import './MyOrders.css';
import EshopLogo from './../../../assets/logoo.png';
import api2 from '../../../endpoints/api2';
import { BASE_URL } from '../../../endpoints/api2';

const MyOrders = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        // Use Promise.all to fetch both orders and products
        Promise.all([
            api.get('api/orders/'),
            api2.get('products/')
        ])
            .then(([ordersResponse, productsResponse]) => {
                const ordersData = ordersResponse.data;
                const productsData = productsResponse.data;

                // Map product IDs to product objects
                const updatedOrders = ordersData.map(order => ({
                    ...order,
                    product: order.product.map(productId =>
                        productsData.find(product => product.id === productId) || { id: productId }
                    )
                }));

                setOrders(updatedOrders);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="tab-content">
            <div className="orders-content">
                <h2 className='orders-title'>Παραγγελίες</h2>
                {isLoading ? (
                    <div className="orders-loading">
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .map((order, index) => (
                                <div key={order.id} className='Orders'>
                                    <div className="order-header">
                                        <h5 className="order-id">Παραγγελία #{index + 1}</h5>
                                    </div>

                                    <div className="order-body">
                                        {/* Products Column */}
                                        <div className="order-products">
                                            <h4 className="products-header">Προϊόντα</h4>
                                            {order.product.map((product, idx) => (
                                                <div key={`${order.id}-${product.id || idx}`} className="product-item">
                                                    <div className="product-image">
                                                        <img
                                                            src={product.image ? `${BASE_URL}${product.image}` : EshopLogo}
                                                            className="card-img-top mx-auto d-block c-img"
                                                            alt={product.name || "Unknown Product"}
                                                        />
                                                    </div>
                                                    <div className="product-info">
                                                        <p className="product-name">{product.name || "Unnamed Product"}</p>
                                                        <p className="product-id">ID: {product.id || "N/A"}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Shipping Info Column */}
                                        <div className="shipping-info">
                                            <h4 className="shipping-header">Διεύθυνση Αποστολής</h4>
                                            <div className="address-details">
                                                <p>{order.shippingAddress?.street || order.address}</p>
                                            </div>
                                            <h4 className="shipping-header">Τιμολόγιο</h4>
                                            <p>{order.price}€</p>
                                        </div>

                                        {/* Date Column */}
                                        <div className="order-date-column">
                                            <div className="date-container">
                                                <span className="date-label">Ημερομηνία:</span>
                                                <span className="order-date">
                                                    {new Date(order.created_at).toLocaleDateString('el-GR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false
                                                    }).replace(',', ', ώρα ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default MyOrders;