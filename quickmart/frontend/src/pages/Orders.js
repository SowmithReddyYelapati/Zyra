import { useEffect, useState } from "react";
import API from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data);
  };

  return (
    <div style={{ padding: "30px" }}>

      <h2>My Orders 📦</h2>

      {orders.map(order => (
        <div key={order._id} className="admin-card">

          <p><b>Total:</b> ₹{order.totalAmount}</p>
          <p><b>Payment:</b> {order.paymentMethod}</p>

          {order.items.map(i => (
            <div key={i.productId}>
              {i.name} x {i.quantity}
            </div>
          ))}

        </div>
      ))}

    </div>
  );
}