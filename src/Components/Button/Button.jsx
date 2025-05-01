import cls from "./Button.module.scss"

const Button = ({
  className = "",
  children,
  onClick,
  disabled = false
}) => {
  return (
    <button 
      disabled={disabled}
      onClick={onClick} 
      className={`${cls.btn} ${className} ${disabled ? cls.disabled : ""}`}
    >
      {children}
    </button>
  )
}

export default Button