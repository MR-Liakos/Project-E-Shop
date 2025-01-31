import React from 'react'
import './Card.css'
import img1 from './../../assets/1.jpg'
import { BASE_URL } from '../../endpoints/api'


const Card = ({product}) => {
    return (
        <>
            <div className="card m-2 c-card">
                <img src={`${BASE_URL}${product.image}`} className="card-img-top mx-auto d-block c-img" alt="..."/>
                    <div className="card-body">
                        
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.description}</p>
                        <a href="#" className="btn c-btn">Προσθήκη στο καλάθι</a>
                    </div>
            </div>
        </>
    )
}
export default Card