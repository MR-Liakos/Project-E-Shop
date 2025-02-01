import React from 'react'
import './Card.css'
import { BASE_URL } from '../../endpoints/api'
import { Link } from 'react-router-dom'


const Card = ({ product }) => {
    return (
        <>
            <div className="card m-2 c-card">
                <Link to={`/product/${product.slug}`} className='link-card'>
                    <img src={`${BASE_URL}${product.image}`} className="card-img-top mx-auto d-block c-img" alt="..." />
                    <div className="card-body">
                        <h3 className="card-title">{product.name}</h3>
                        <p className="card-price">{product.price}€</p>
                    </div>
                </Link>
                <Link to="#" className="btn c-btn">Προσθήκη στο καλάθι</Link>

            </div >
        </>
    )
}
export default Card