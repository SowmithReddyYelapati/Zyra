import { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import Cart from "../components/Cart";
import ReorderSuggestions from "../components/ReorderSuggestions";
import VoiceShopping from "../components/VoiceShopping";
import VisualSearch from "../components/VisualSearch";
import API from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="max-w-[1700px] mx-auto px-4 md:px-8 py-8 w-full animate-fade-in">
      {/* AI Feature Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <ReorderSuggestions />
        <VoiceShopping products={products} />
        <VisualSearch products={products} />
      </div>

      {/* Main Layout: Products | Cart sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3">
          <ProductList products={products} />
        </div>
        <div className="lg:col-span-1 lg:sticky lg:top-[88px]">
          <Cart products={products} />
        </div>
      </div>
    </div>
  );
}

export default Products;