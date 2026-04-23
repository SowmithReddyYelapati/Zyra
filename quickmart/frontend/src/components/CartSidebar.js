import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartSidebar() {
  const { cart, increase, decrease } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-sidebar-fixed">

      <h3>🛒 Your Cart</h3>

      {cart.length === 0 && <p>No items</p>}

      {cart.map(item => (
        <div key={item._id} className="sidebar-item">

          <div>
            <p>{item.name}</p>
            <p>₹{item.price}</p>
          </div>

          <div className="qty-control">
            <button onClick={() => decrease(item._id)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => increase(item._id)}>+</button>
          </div>

        </div>
      ))}

      <h4>Total: ₹{total}</h4>

      <button
        className="checkout-btn"
        onClick={() => navigate("/checkout")}
      >
        Proceed to Payment →
      </button>

    </div>
  );
}