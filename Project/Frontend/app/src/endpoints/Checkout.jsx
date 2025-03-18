import React, { useEffect, useState, useContext } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import api from './api';
import { useNavigate } from "react-router-dom";
import { CartContext } from '../Components/SmallComponents/CartContext';
import api2 from './api2';

const Checkout = ({ price, id, address }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    const navigate = useNavigate();
    const { fetchCartQuantity } = useContext(CartContext);

    
    
    const onCreateOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: price,
                    },
                },
            ],
        });
    }

    const onApproveOrder = async (data, actions) => {
        return actions.order.capture().then(async (details) => {
            const name = details.payer.name.given_name;
            // Retrieve the order details by awaiting the API call
            try {
                // Await the API call to get the order details
                const orderResponse = await api.get(`/api/orders/${id}/`);
                // Assuming orderResponse.data has the order data
                const orderData = orderResponse.data;

                
                // Update stock based on order items
                for (const item of orderData.order_items) {
                    await api2.patch(`/update-stock/${item.product}/`, {
                        quantity: item.quantity
                    });
                }
                
                // Now update the order to mark it as paid, add address, etc.
                await api.patch(`/api/orders/${id}/`, {
                    paid: true,
                    address: address,
                    PaymentMeth: 'PayPal',
                });
                
                // Update the cart quantity
                await fetchCartQuantity();
                await api.get(`/api/ordersemail/${id}/`);
                // Navigate to Order Confirmation
                navigate("/OrderConfirmation", { state: { orderId: id } });
            } catch (error) {
                console.error("Failed to update order or stock:", error);
            }
        });
    };

    return (
        <div className="checkout d-flex justify-content-center align-items-center" >
            {isPending ? <p>LOADING...</p> : (
                <div style={{width: "100%",maxWidth: "500px" ,margin: "0,auto"}}>
                    <PayPalButtons
                        style={{
                            layout: "vertical",  
                            color: "gold",       
                            shape: "rect",       
                            height: 48,          
                            label: "checkout",  
                            tagline: false       
                        }} createOrder={(data, actions) => onCreateOrder(data, actions)}
                        onApprove={(data, actions) => onApproveOrder(data, actions)}
                    />
                </div>
            )}
        </div>
    );
}

export default Checkout;