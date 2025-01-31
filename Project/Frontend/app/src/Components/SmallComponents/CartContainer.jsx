import React from 'react'
import Card from './Card'



const CartContainer = ({products}) => {
    return (
        <>
            <div className="CartContainer1">

                {products.map(product=> <Card key={product.id} product ={product} />)}

            </div>
        </>
    )
}
export default CartContainer