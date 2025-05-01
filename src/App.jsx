import { useCallback, useEffect, useState } from 'react';
import cls from './App.module.scss';
import Card from './Components/Card/Card';
import Cart from './Components/Cart';
import { getData } from './Constants/db';

const courses = getData();
const telegram = window.Telegram.WebApp;

const App = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const onAddItem = (item) => {
    const isAvailable = cartItems.find((course) => course.id === item.id);

    if (isAvailable) {
      const data = cartItems.map((course) =>
        course.id === item.id ? { ...isAvailable, quantity: isAvailable.quantity + 1 } : course
      );
      setCartItems(data);
    } else {
      const newData = [...cartItems, { ...item, quantity: 1 }];
      setCartItems(newData);
    }
  };

  const onRemoveItem = (item) => {
    const isAvailable = cartItems.find((course) => course.id === item.id);

    if (isAvailable.quantity === 1) {
      const newData = cartItems.filter((course) => course.id !== isAvailable.id);
      setCartItems(newData);
    } else {
      const newData = cartItems.map((course) =>
        course.id === isAvailable.id ? { ...isAvailable, quantity: isAvailable.quantity - 1 } : course
      );
      setCartItems(newData);
    }
  };

  const onCheckout = () => {
    if (cartItems.length === 0) {
      telegram.showAlert('Your cart is empty!');
      return;
    }
    telegram.MainButton.setText('Purchase :)');
    telegram.MainButton.show();
  };

  const onSendData = useCallback(() => {
    const queryId = telegram.initDataUnsafe.query_id;

    if (cartItems.length === 0) {
      telegram.showAlert('Your cart is empty!');
      return;
    }

    const dataToSend = JSON.stringify(cartItems);

    if (queryId) {
      fetch('https://salimjonovdavron-web-tg-bot-b461901c2af9.herokuapp.com/web-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ queryId, products: cartItems }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setCartItems([]);
            localStorage.removeItem('cartItems');
            telegram.MainButton.hide();
          }
        })
        .catch((error) => {
          console.error('Purchase failed:', error);
          telegram.showAlert('Purchase failed. Please try again.');
        });
    } else {
      telegram.sendData(dataToSend);
    }
  }, [cartItems]);

  useEffect(() => {
    telegram.onEvent('mainButtonClicked', onSendData);
    return () => {
      telegram.offEvent('mainButtonClicked', onSendData);
    };
  }, [onSendData]);

  useEffect(() => {
    telegram.ready();
  }, []);

  return (
    <div>
      <h1 className={cls.header}>Full Stack Courses</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className={cls.cards__container}>
        {courses.map((course, index) => (
          <Card
            key={course.id}
            course={course}
            index={index + 1}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
};

export default App;