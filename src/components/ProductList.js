import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard"; 
import "../styles/ProductList.css"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productsSlice";

const ProductList = ({isStaffPanel = false}) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const loading = useSelector((state) => state.products.isLoading);
  const error = useSelector((state) => state.products.error);

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
  }

  return (
      <div className="product-list">
          {products.length > 0 ? (
              products.map((product) => (
                  <ProductCard
                      key={product.id}
                      product={product}
                      isStaffPanel={isStaffPanel}
                      onDelete={handleDelete}
                      id = {product.id}
                  />
              ))
          ) : (
              <div>No products available.</div>
          )}
      </div>
  );

};

export default ProductList;