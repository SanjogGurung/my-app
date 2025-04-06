import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard"; 
import "../styles/ProductList.css"; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete this ${name}}?`)) {
      try {
        await axios.delete(`http://localhost:8082/product/${id}`);
        setProducts(products.filter(product => product.id !== id));
        alert("Product deleted successfully!");
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete product.");
      }
    }
  };

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8082/product/products");
        console.log("Response : ", response.data);
        setProducts(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
        console.log("Products : ", products)

      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
        console.error(err);     
      }
    };

    fetchProducts();
  }, []); 

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            id={product.id}
            image={`http://localhost:8082/product/${product.id}/image`} 
            name={product.name}
            price={product.price}
            isStaffPanel = {true}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <div>No products available.</div>
      )}
    </div>
  );
};

export default ProductList;