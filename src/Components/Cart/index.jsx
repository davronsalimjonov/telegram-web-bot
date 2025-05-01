import Button from "../Button/Button"
import { getTotalPrice } from "../totalPrice"
import cls from "./Cart.module.scss"

const Cart = ({
    cartItems = [],
    onCheckout
}) => {
  return (
    <div className={cls.cart__container}>
        <p>Total: {getTotalPrice(cartItems).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        })}</p>
        <Button 
            className={cls.cart__container__checkout}
            disabled={cartItems.length === 0 ? true : false}
            onClick={onCheckout}
        >{cartItems.length === 0 ? "Order" : "Purchase"}</Button>
    </div>
  )
}

export default Cart