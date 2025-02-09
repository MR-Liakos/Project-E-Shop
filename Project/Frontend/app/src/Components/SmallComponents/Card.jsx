import React, { useState } from 'react'
import './Card.css'
import { BASE_URL } from '../../endpoints/api2'
import { Link } from 'react-router-dom'
import { FaRegHeart, FaHeart } from "react-icons/fa";

const Card = ({ product }) => {
    const [isFavorited, setIsFavorited] = useState(false)

    const handleFavoriteToggle = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsFavorited(!isFavorited)
        // Add your API call or state management logic here
    }

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
            
            <Link to="#" className="btn c-btn">
                Προσθήκη στο καλάθι
            </Link>
        </div>
    )
}

export default Card;
