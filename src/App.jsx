import { useCallback, useEffect, useState } from 'react'
import cls from './App.module.scss'
import Card from './Components/Card/Card'
import Cart from './Components/Cart'
import { getData } from './Constants/db'

const courses = getData()

const telegram = window.Telegram.WebApp

const App = () => {
  const [cartItems, setCartItems] = useState([])

  const onAddItem = (item) => {
    const isAvailable = cartItems.find((course) => course.id === item.id)

    if (isAvailable) {
      const data = cartItems.map((course) => course.id === item.id ? { ...isAvailable, quantity: isAvailable.quantity + 1 } : course)
      setCartItems(data)
    } else {
      const newData = [...cartItems, { ...item, quantity: 1 }]
      setCartItems(newData)
    }
  }

  const onRemoveItem = (item) => {
    const isAvailable = cartItems.find((course) => course.id === item.id)

    if (isAvailable.quantity === 1) {
      const newData = cartItems.filter((course) => course.id !== isAvailable.id)
      setCartItems(newData)
    } else {
      const newData = cartItems.map((course) => course.id === isAvailable.id ? { ...isAvailable, quantity: isAvailable.quantity - 1 } : course)
      setCartItems(newData)
    }
  }

  const onCheckout = () => {
    telegram.MainButton.setText('Purchase :)');
    telegram.MainButton.onClick(() => {
      telegram.sendData(JSON.stringify(cartItems));
    });
    telegram.MainButton.show();
  };

  const onSendData = useCallback(() => {
    telegram.sendData(JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    telegram.onEvent('mainButtonClicked', onSendData)

    return () => {
      telegram.offEvent('mainButtonClicked', onSendData)
    }
  }, [onSendData])

  useEffect(() => {
    telegram.ready();
  }, []);
  
  return (
    <div>
      <h1 className={cls.header}>Full Stack Courses</h1>
      <Cart
        cartItems={cartItems}
        onCheckout={onCheckout}
      />
      <div className={cls.cards__container}>
        {courses.map((course, index) => (
          <Card
            course={course}
            index={index + 1}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </div>
  )
}

export default App
