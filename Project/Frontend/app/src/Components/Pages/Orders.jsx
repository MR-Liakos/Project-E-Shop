import React, { useEffect, useState } from 'react';
import TopNavbar from '../Navbars/TopNavbar';
import Navbar from '../Navbars/Navbar';
import Footer from '../Navbars/Footer';
import api from '../../endpoints/api'; // Ensure this points to your API functions
import Cookies from 'js-cookie';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');  // Get token from cookies
      console.log(token);
      console.log(document.cookies);
      

      if (!token) {
        setError('Unauthorized: No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('orders/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error("Error fetching orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <TopNavbar />
      <Navbar />
      <div className="home-container">
            mpikame

        <Footer />
      </div>
    </>
  );
};

export default Orders;
