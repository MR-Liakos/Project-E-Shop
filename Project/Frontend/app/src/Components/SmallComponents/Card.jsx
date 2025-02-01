import React from 'react'
import './Card.css'
import { BASE_URL } from '../../endpoints/api'
import { Link } from 'react-router-dom'


const Card = ({ product }) => {
    return (
        <>
            <div className="card m-2 c-card">
                <Link to={`/product/${product.slug}`} className="">
                    <img src={`${BASE_URL}${product.image}`} className="card-img-top mx-auto d-block c-img" alt="..." />
                    <div className="card-body">

                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.price}</p>
                    </div>
                </Link>
                <a href="#" className="btn c-btn">Προσθήκη στο καλάθι</a>

            </div >
        </>
    )
}
export default Card