import { useState } from "react"
import Button from "../Button/Button"
import cls from "./Card.module.scss"

const Card = ({
  course = {},
  index = 1,
  onAddItem,
  onRemoveItem
}) => {
  const [count, setCount] = useState(0)

  const handleIncrement = () => {
    setCount(prev => prev + 1)
    onAddItem(course)
  }

  const handleDecrement = () => {
    setCount(prev => prev - 1)
    onRemoveItem(course)
  }
  
  return (
    <div className={cls.card} key={course.id}>
      <span className={count !== 0 ? cls.card__badge : cls.none}>{count}</span>

      <div className={cls.image__container}>
        <img
          src={course.Image}
          alt={course.title}
          width={'100%'}
          height={'230px'}
        />
      </div>

      <div className={cls.card__body}>
        <h2 className={cls.card__title}>{course.title}</h2>
        <p className={cls.card__price}>{course.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        })}</p>
      </div>

      <div className="hr"></div>

      <div className={cls.btn__container}>
        <Button 
          className={cls.btn__container__add}
          onClick={handleIncrement}
        >+</Button>
        {count !== 0 && (
          <Button
          className={cls.btn__container__remove}
          onClick={handleDecrement}
        >-</Button>
        )}
      </div>
    </div>
  )
}

export default Card