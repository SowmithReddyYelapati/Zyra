import { useState, useEffect } from "react";
import API from "../services/api";

export default function AdminDashboard() {

  // 🟢 PRODUCT STATE
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: ""
  });

  const [editId, setEditId] = useState(null);

  // 🟣 ORDER STATE
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ================= PRODUCTS =================

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const handleSubmit = async () => {
    if (editId) {
      await API.put(`/admin/update-product/${editId}`, product);
      setEditId(null);
    } else {
      await API.post("/admin/add-product", product);
    }

    setProduct({ name: "", price: "", category: "", image: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await API.delete(`/admin/delete-product/${id}`);
    fetchProducts();
  };

  const handleEdit = (p) => {
    setProduct({
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image
    });
    setEditId(p._id);
  };

  // ================= ORDERS =================

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data);
  };

  // ================= UI =================

  return (
    <div className="admin-container">

      <h1>Admin Dashboard 🧑‍💼</h1>

      {/* ================= ADD / EDIT PRODUCT ================= */}
      <div className="admin-card">

        <h3>{editId ? "Edit Product" : "Add Product"}</h3>

        <input
          placeholder="Product Name"
          value={product.name}
          onChange={e => setProduct({ ...product, name: e.target.value })}
        />

        <input
          placeholder="Price"
          value={product.price}
          onChange={e => setProduct({ ...product, price: e.target.value })}
        />

        <input
          placeholder="Category"
          value={product.category}
          onChange={e => setProduct({ ...product, category: e.target.value })}
        />

        <input
          placeholder="Image URL"
          value={product.image}
          onChange={e => setProduct({ ...product, image: e.target.value })}
        />

        <button onClick={handleSubmit}>
          {editId ? "Update Product ✏️" : "Add Product ➕"}
        </button>

      </div>

      {/* ================= PRODUCT LIST ================= */}
      <div className="admin-products">

        {products.map(p => (
          <div key={p._id} className="admin-product-card">

            <img src={p.image} alt={p.name} />

            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <span>{p.category}</span>

            <div className="admin-actions">

              <button
                className="edit-btn"
                onClick={() => handleEdit(p)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* ================= ORDERS SECTION ================= */}

      <h2 style={{ marginTop: "40px" }}>All Orders 📦</h2>

      {orders.map(order => (
        <div key={order._id} className="admin-card">

          <p><b>Total:</b> ₹{order.totalAmount}</p>
          <p><b>Payment:</b> {order.paymentMethod}</p>

          <div style={{ marginTop: "10px" }}>
            {order.items.map(i => (
              <p key={i.productId}>
                {i.name} × {i.quantity}
              </p>
            ))}
          </div>

        </div>
      ))}

    </div>
  );
}