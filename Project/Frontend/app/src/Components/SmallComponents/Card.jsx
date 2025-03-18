import React, { useEffect, useState, useContext } from 'react';
import './Card.css'
import { BASE_URL } from '../../endpoints/api2'
import { Link } from 'react-router-dom'
import { FaRegHeart, FaHeart } from "react-icons/fa";
import api from '../../endpoints/api';
import { CartContext } from './CartContext';
import { useNavigate } from "react-router-dom";
import { MdOutlineStarPurple500 } from "react-icons/md";

const Card = ({ product }) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const isLoggedInLocal = localStorage.getItem("loggedIn") === "true";
  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const { fetchCartQuantity } = useContext(CartContext);
  const [showSuccessModal2, setshowSuccessModal2] = useState(false);
  const [showSuccessModal3, setshowSuccessModal3] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkInitialFavorite = async () => {
      if (isLoggedInLocal) {
        try {
          const response = await api.get('api/user/');
          setIsFavorited(response.data.favorites.includes(product.id));
        } catch (err) {
          console.error("Error checking favorites:", err);
        }
      }
    };

    if (product.id) {
      checkInitialFavorite();
    }
  }, [product.id]);

  const handleFavoriteToggle = async (e) => {
    if (isLoggedInLocal) {
      e.preventDefault();
      e.stopPropagation();
      if (!product?.id) return;


      const previousState = isFavorited;

      try {
        // Optimistic UI update
        setIsFavorited(!previousState);

        // Update favorites on backend
        const response = await api.put('/api/favorite/', {
          favorites: previousState
            ? (await api.get('api/user/')).data.favorites.filter(id => id !== product.id)
            : [...(await api.get('api/user/')).data.favorites, product.id]
        });

        // Final update from server response
        setIsFavorited(response.data.favorites.includes(product.id));
      } catch (err) {
        // Rollback on error
        setIsFavorited(previousState);
        console.error("Favorite update failed:", err);
      }
    } else {
      navigate("/LovedAuth")
    }
  };


  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedInLocal) {
      //alert("Πρέπει να συνδεθείτε για να προσθέσετε προϊόντα στο καλάθι.");
      navigate("/LovedAuth")
      return;
    }

    if (!showQuantitySelector) {
      setShowQuantitySelector(true);
      return;
    }

    try {
      // 1. Ανάκτηση όλων των παραγγελιών που δεν έχουν πληρωθεί
      const existingOrderResponse = await api.get("/api/orders/", {
        params: { paid: false }
      });

      // Φιλτράρουμε μόνο τις unpaid παραγγελίες
      const unpaidOrders = existingOrderResponse.data.filter(order => order.paid === false);

      let existingOrder = null;

      if (unpaidOrders.length > 1) {
        // Αν υπάρχουν περισσότερες από μία, ταξινομούμε τον πίνακα με βάση το id (υποθέτουμε ότι το μικρότερο id είναι η παλαιότερη παραγγελία)
        unpaidOrders.sort((a, b) => a.id - b.id);
        // Κρατάμε την πιο πρόσφατη παραγγελία (δηλαδή, το τελευταίο στοιχείο μετά το sort)
        const orderToKeep = unpaidOrders[unpaidOrders.length - 1];

        // Διαγράφουμε όλες τις παραγγελίες εκτός από την πιο πρόσφατη
        for (let i = 0; i < unpaidOrders.length - 1; i++) {
          const orderToDelete = unpaidOrders[i];
          await api.delete(`/api/orders/${orderToDelete.id}/`);
          //console.log(`Deleted old order with id: ${orderToDelete.id}`);
        }

        existingOrder = orderToKeep;
      } else if (unpaidOrders.length === 1) {
        existingOrder = unpaidOrders[0];
      } else {
        existingOrder = null;
      }

      // 2. Προετοιμασία δεδομένων για το αίτημα
      const requestData = {
        order_items: [{
          product: product.id,
          quantity: quantity
        }]
      };

      let response;
      if (requestData.order_items[0].quantity > product.stock) {
        setshowSuccessModal3(true);
        setTimeout(() => setshowSuccessModal3(false), 3000);
      } else {
        // Αν υπάρχει unpaid παραγγελία, κάνουμε ενημέρωση (PATCH), αλλιώς δημιουργούμε νέα παραγγελία (POST)
        if (existingOrder && existingOrder.paid === false) {
          //console.log('Updating existing order:', existingOrder.id);
          response = await api.patch(
            `/api/orders/${existingOrder.id}/`,
            requestData
          );
        } else {
          //console.log('Creating new order');
          response = await api.post("/api/orders/", requestData);
        }
        await fetchCartQuantity();
        setshowSuccessModal2(true);
        setTimeout(() => setshowSuccessModal2(false), 3000);
        setShowQuantitySelector(false);
      }
    } catch (err) {
      //console.error("Error adding to cart:", err);
      alert("Αποτυχία προσθήκης στο καλάθι. Έχετε ήδη αυτό το προϊόν στο καλάθι;");

    }
  };



  return (
    <div className="card m-2 c-card text-center card-container" >
      <button
        className="favourite-icon"
        onClick={handleFavoriteToggle}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorited ? (
          <FaHeart className="filled-icon" />
        ) : (
          <FaRegHeart className="outline-icon" />
        )}
      </button>

      <div className="link-wrapper">
        <Link to={`/product/${product.slug}`} className='link-card'>
          <img
            src={`${BASE_URL}${product.image}`}
            className="card-img-top mx-auto d-block c-img"
            alt={product.name}
          />
        </Link>

        <div className="card-body">
          <Link to={`/product/${product.slug}`} className="link-card">
            <h3 className="card-title ">{product.name}</h3>
          </Link>
          <Link to={`/product/${product.slug}`} className="link-card">
            <p className="card-price">
              {product.stock < 1 ? "Εκτός αποθέματος" : `${product.price}€`}
            </p>
          </Link>
        </div>

        <div className="product-actions c-btn-container">
          {!showQuantitySelector ? (
            <button
              onClick={handleAddToCart}
              className="btn c-btn"
            >
              Προσθήκη στο καλάθι
            </button>
          ) : (
            <button className="btn c-btn flex items-center justify-between">
              <span
                className="quantity-decrease "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity(quantity > 1 ? quantity - 1 : 1);
                  // Δεν καλούμε το handleAddToCart εδώ αφού θα αλλάξει μόνο την ποσότητα
                }}
              >
                -
              </span>
              <span className="quantity-value px-3">{quantity}</span>
              <span
                className="quantity-increase px-3"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity(quantity + 1);
                  // Δεν καλούμε το handleAddToCart εδώ αφού θα αλλάξει μόνο την ποσότητα
                }}
              >
                +
              </span>
              <span
                className="confirm-btn px-3 ml-2"
                onClick={handleAddToCart}
              >
                ✓
              </span>
            </button>
          )}
        </div>
      </div>

      {showSuccessModal2 && (
        <div className="success-message visible">
          <MdOutlineStarPurple500 className="success-icon" />
          🎉 Το προϊόν προστέθηκε επιτυχώς στο καλάθι σας!
        </div>
      )}

      {showSuccessModal3 && (
        <div className="nosuccess-message visible">
          <MdOutlineStarPurple500 className="success-icon" />
          ⚠️ Δεν είναι δυνατή η προσθήκη! Το προϊόν είναι εκτός αποθέματος.
        </div>
      )}
    </div>
  )
}

export default Card;
