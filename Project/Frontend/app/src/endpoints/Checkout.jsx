import React, { useState, useEffect } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import api from './api';
import { useNavigate } from "react-router-dom";

const Checkout = ({ price, id, address }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    const navigate = useNavigate();

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
            //const address = details.purchase_units[0].shipping.address; // Get the address

            try {
                await api.patch(`api/orders/${id}/`, {
                    paid: true,
                    address: address,//`${address.address_line_1}, ${address.admin_area_2}, ${address.admin_area_1}, ${address.postal_code}, ${address.country_code}`,
                    PaymentMeth: 'PayPal',
                });
                console.log(id);
                
                navigate("/OrderConfirmation", { state: { orderId: id } });
            } catch (error) {
                console.error("Failed to update order:", error);
            }
        });
    };

    return (
        <div className="checkout">
            {isPending ? <p>LOADING...</p> : (
                <>
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
                </>
            )}
        </div>
    );
}

export default Checkout;