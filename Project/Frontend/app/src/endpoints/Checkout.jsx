import React, { useState, useEffect } from 'react';
//import './Checkout.css';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import api from './api';
import { useNavigate } from "react-router-dom";

const Checkout = ({ price ,id,address}) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    const [currency, setCurrency] = useState(options.currency);
    const navigate = useNavigate();

    const onCurrencyChange = ({ target: { value } }) => {
        setCurrency(value);
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: value,
            },
        });
    }

    const onCreateOrder = (data,actions) => {
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
            const address = details.purchase_units[0].shipping.address; // Get the address
            
            try {
                await api.patch(`api/orders/${id}/`, { 
                    paid: true, 
                    address: `${address.address_line_1}, ${address.admin_area_2}, ${address.admin_area_1}, ${address.postal_code}, ${address.country_code}`,//THelv na to dvvvvv
                    PaymentMeth: 'PayPal',
                });
                navigate("/OrderConfirmation", { state: { id } });
            } catch (error) {
                console.error("Failed to update order:", error);
            }
        });
    };

    return (
        <div className="checkout">
            {isPending ? <p>LOADING...</p> : (
                <>
                    <select value={currency} onChange={onCurrencyChange}>
                            <option value="USD">💵 USD</option>
                            <option value="EUR">💶 Euro</option>
                    </select>
                    <PayPalButtons 
                        style={{ layout: "vertical" }}
                        createOrder={(data, actions) => onCreateOrder(data, actions)}
                        onApprove={(data, actions) => onApproveOrder(data, actions)}
                    />
                </>
            )}
        </div>
    );
}

export default Checkout;