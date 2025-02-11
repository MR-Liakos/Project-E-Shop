import React, { useState,useEffect } from 'react'
import api from '../../../endpoints/api';

const MyOrders = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(function () {
        setIsLoading(true)

        api.get(`api/orders/`).then(res => {
            console.log(res.data);
            setOrders(res.data);  
            setIsLoading(false);
        })
            .catch(err => {
                console.log("Error sto Orders", err.message,);
                setIsLoading(false)

            })

    }, [])


    return (
        <>
            <div className="tab-content">
                <h2>Παραγγελίες</h2>
                <p>Εδώ εμφανίζονται οι παραγγελίες σας.</p>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    orders.map(order => (
                        <div key={order.id}>
                            <h5 className="order-title">Order ID: {order.id}</h5>
                            <h5 className="order-title">User: {order.user}</h5>
                            <p className="order-text">Product: {order.product}</p>
                            <p className="order-description">Date: {order.created_at}</p>
                            <hr />
                        </div>
                    ))
                )}
            </div>
        </>
    )
}

export default MyOrders