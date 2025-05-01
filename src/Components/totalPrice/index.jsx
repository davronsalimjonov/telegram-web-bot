export const getTotalPrice = (cartItems) => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) 
}