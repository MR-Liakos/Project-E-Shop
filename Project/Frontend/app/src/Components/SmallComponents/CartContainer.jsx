import React from 'react';
import Card from './Card';
import './CartContainer.css';

const CartContainer = ({ products }) => {
  return (
    <div className="cart-container">
      {products && products.length > 0 ? (
        products.map(product => (
          <Card key={product.id} product={product} />
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};
export default CartContainer;