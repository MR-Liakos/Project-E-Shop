import React, { useEffect, useState } from 'react';
import './Card.css'
import { BASE_URL } from '../../endpoints/api2'
import { Link } from 'react-router-dom'
import { FaRegHeart, FaHeart } from "react-icons/fa";
import api from '../../endpoints/api';

const Card = ({ product }) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const isLoggedInLocal = localStorage.getItem("loggedIn") === "true";
  // Get initial favorite status from API
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
      if (!product?.id ) return;

      
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
    }
  };
  const handleAddToCart = async (e) => {
  console.log("mphkeee");
  
  };

  return (
    <div className="card m-2 c-card text-center">
      <button
        className="favourite-icon"
        onClick={handleFavoriteToggle}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorited ? (
          <FaHeart size="1.5rem" className="filled-icon" />
        ) : (
          <FaRegHeart size="1.5rem" className="outline-icon" />
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
            <h3 className="card-title">{product.name}</h3>
          </Link>
          <Link to={`/product/${product.slug}`} className="link-card">
            <p className="card-price">{product.price}€</p>
          </Link>
        </div>
      </div>

      <button onClick={handleAddToCart} className="btn c-btn">
        Προσθήκη στο καλάθι
      </button>
    </div>
  )
}

export default Card;
