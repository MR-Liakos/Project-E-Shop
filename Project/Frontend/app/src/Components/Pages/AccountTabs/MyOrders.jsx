import React, { useState, useEffect } from 'react';
import api from '../../../endpoints/api';
import api2, { BASE_URL } from '../../../endpoints/api2';
import { Link } from 'react-router-dom';
import './MyOrders.css';
import EshopLogo from './../../../assets/logoo.png';

const MyOrders = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setIsLoading(true);
    
        Promise.all([
            api.get('api/orders/', { params: { paid: "true" } }),
            api2.get('products/')
        ])
            .then(([ordersResponse, productsResponse]) => {
                const ordersData = ordersResponse.data;
                const productsData = productsResponse.data;
    
                const productMap = productsData.reduce((acc, product) => {
                    acc[product.id] = product;
                    return acc;
                }, {});
    
                const updatedOrders = ordersData.map(order => ({
                    ...order,
                    order_items: order.order_items.map(item => ({
                        ...item,
                        product: productMap[item.product] || { id: item.product, name: item.product_name, slug: "", image: null }
                    }))
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
        <div className="tab-account-content">
            <div className="orders-content text-center">
                <h2 className='orders-title'>Οι Παραγγελίες μου</h2>
                <p className="orders-subtitle text-start">Εδώ εμφανίζονται οι παραγγελίες σας.</p>
                {isLoading ? (
                    <div className="orders-loading">
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.length === 0 ? (
                        <div className="no-orders-message text-start">
                            Δεν βρέθηκαν παραγγελίες.
                        </div>
                    ) : (
                        orders
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .map((order, index) => (
                                <div key={order.id} className='Orders'>
                                    <div className="order-header">
                                        <h5 className='order-label'>Λεπτομέρειες Παραγγελίας</h5>
                                    </div>
                                    <div className="order-body">
                                        {/* Products Column */}
                                        <div className="order-products">
                                            {order.order_items.map((item, idx) => (
                                                <div key={`${order.id}-${item.id || item.product.id || idx}`} className="product-item">
                                                    <div className="product-info">
                                                        <Link to={`/product/${item.product.slug}`} className='link-card'>
                                                            <p className="product-name">
                                                                Όνομα Προϊόντος: {item.product.name || "Unnamed Product"}
                                                            </p>
                                                        </Link>
                                                        <p className="product-quantity">Ποσότητα: {item.quantity}</p>
                                                    </div>
                                                    <div className="product-image">
                                                        <Link to={`/product/${item.product.slug}`} className='link-card'>
                                                            <img
                                                                src={item.product.image ? `${BASE_URL}${item.product.image}` : EshopLogo}
                                                                className="card-img-top mx-auto d-block order-prod-image"
                                                                alt={item.product.name || "Unknown Product"}
                                                            />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Combined Info Column */}
                                        <div className="shipping-info">
                                            <div className="info-group">
                                                <span className="shipping-header">Διεύθυνση Αποστολής </span>
                                                <div className="address-details">{order.address || "Δεν έχει οριστεί"}</div>
                                            </div>

                                            <div className="info-group">
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

                                    <div className='order-footer'>
                                        <div className='prod-price mt-5'>
                                            <h4 className="Price-header text-end">Σύνολο: {order.price}€</h4>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                            
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
