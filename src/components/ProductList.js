import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "../styles/ProductList.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productsSlice";

const ProductList = ({ isStaffPanel = false, searchTerm = "" }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const loading = useSelector((state) => state.products.isLoading);
  const error = useSelector((state) => state.products.error);

  // Filtered products for staff panel
  const filteredProducts = isStaffPanel
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleDelete = () => {
    console.log("Deleted !!!");
  };

  return (
    <div className="product-list">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isStaffPanel={isStaffPanel}
            onDelete={handleDelete}
            id={product.id}
          />
        ))
      ) : (
        <div>No products {isStaffPanel && searchTerm ? "match your search." : "available."}</div>
      )}
    </div>
  );
};

export default ProductList;