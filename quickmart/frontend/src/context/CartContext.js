import { createContext, useContext, useState } from "react";
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ADD ITEM
  const addToCart = (product) => {
    const exist = cart.find((item) => item._id === product._id);

    if (exist) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
      toast.success(`Increased ${product.name} quantity.`);
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
      toast.success(`${product.name} added to cart!`, { icon: '🛒' });
    }
  };

  // ✅ UPDATE QTY (FIXED ERROR)
  const updateQty = (id, type) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? {
                ...item,
                qty: type === "inc" ? item.qty + 1 : item.qty - 1,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // REMOVE ITEM
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// CUSTOM HOOK
export const useCart = () => useContext(CartContext);