import React from 'react'
import './Card.css'
import img1 from './../../assets/1.jpg'
const Card = () => {
    return (
        <>
            <div className="card m-2 c-card">
                <img src={img1} className="card-img-top mx-auto d-block c-img" alt="..."/>
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <a href="#" className="btn c-btn">Προσθήκη στο καλάθι</a>
                    </div>
            </div>
        </>
    )
}
export default Card