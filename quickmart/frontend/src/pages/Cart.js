import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((a, i) => a + i.price * i.quantity, 0);

  return (
    <div className="container">
      <h1>Cart</h1>

      {cart.map(i => (
        <div key={i._id} className="cart-item">
          <span>{i.name} x {i.quantity}</span>
          <span>₹{i.price * i.quantity}</span>
        </div>
      ))}

      <h2>Total: ₹{total}</h2>

      <button onClick={() => navigate("/checkout")}>
        Proceed to Checkout
      </button>
    </div>
  );
}