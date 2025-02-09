import React, { useEffect, useState } from 'react';
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import api from '../../endpoints/api'
import { useParams } from 'react-router-dom';

const Orders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { slug } = useParams()
  const [orders, setOrders] = useState([]);


  useEffect(function () {
    setIsLoading(true)

    api.get(`api/orders/`).then(res => {
      console.log(res.data);
      setOrders(res.data);  // ✅ Correct - Store the array properly
      setIsLoading(false);
    })
      .catch(err => {
        console.log("Error sto Orders", err.message,);
        setIsLoading(false)

      })

  }, [])

  return (
    <>
      <TopNavbar />
      <Navbar />
      <div className="home-container">

        {orders.map(order => (
          <div key={order.id}>
            <h5 className="order-title">Order ID: {order.id}</h5>
            <h5 className="order-title">User: {order.user}</h5>
            <p className="order-text">Product: {order.product}</p>
            <p className="order-description">Date: {order.created_at}</p>
            <hr />
          </div>
        ))}
        <Footer />
      </div>
    </>
  );
};

export default Orders;
