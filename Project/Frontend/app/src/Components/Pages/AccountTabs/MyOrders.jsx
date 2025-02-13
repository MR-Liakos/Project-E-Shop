import React, { useState, useEffect } from 'react'
import api from '../../../endpoints/api';
import './MyOrders.css'
import EshopLogo from './../../../assets/logoo.png';

const MyOrders = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setIsLoading(true)
        api.get(`api/orders/`)
            .then(res => {
                setOrders(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error:", err);
                setIsLoading(false)
            })
    }, [])

    return (
        <>
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
                                            {/* 1η Στήλη - Φωτογραφία */}
                                            <div className="order-image">
                                                <img
                                                    src={EshopLogo}
                                                    alt="Eshop Logo"
                                                    className="product-logo"
                                                />
                                            </div>

                                            {/* 2η Στήλη - Διεύθυνση */}
                                            <div className="shipping-info">
                                                <h4 className="shipping-header">Διεύθυνση Αποστολής</h4>
                                                <div className="address-details">
                                                    <p>{order.shippingAddress?.street || "Παράδειγμα Οδού 123"}</p>
                                                    <p>{order.shippingAddress?.city || "Αθήνα"}</p>
                                                    <p>{order.shippingAddress?.postCode || "12345"}</p>
                                                </div>
                                            </div>

                                            {/* 3η Στήλη - Ημερομηνία */}
                                            <div className="order-date-column">
                                                <div className="date-container">
                                                    <span className="date-label">Ημερομηνία:</span>
                                                    <span className="order-date">
                                                        {new Date(order.created_at).toLocaleDateString('el-GR', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div >
        </>
    )
}

export default MyOrders