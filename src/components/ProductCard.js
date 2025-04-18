import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

const ProductCard = ({
  product,
  isStaffPanel = false,
  onDelete,
  id
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const discountedPrice =
    product.isOnSale && product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent Link navigation
    if (window.confirm(`Are you sure you want to delete ${id}?`)) {
      try {
        await axios.delete(`http://localhost:8082/product/${id}`);
        alert("Product deleted successfully!");
        onDelete(product.id);
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete product.");
      }
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent Link navigation
    console.log(`Added ${product.name} to cart`);
    alert(`${product.name} added to cart!`);
  };

  const cardContent = (
    <div className="product-card">
      {product.isOnSale && <div className="sale-badge">Sale</div>}
      <div className="product-image">
        <img src={`http://localhost:8082/product/${id}/image/1`} alt={product.name} />
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <div className="price-container">
          {product.isOnSale && product.discountPercentage > 0 ? (
            <>
              <p className="product-price original-price">${product.price.toFixed(2)}</p>
              <p className="product-price discounted-price">
                ${discountedPrice.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="product-price">${product.price.toFixed(2)}</p>
          )}
        </div>
        {product.isOnSale && product.discountPercentage > 0 && (
          <p className="discount-info">Save {product.discountPercentage}%</p>
        )}
        {isStaffPanel ? (
          <div className="staff-actions">
            <Link
              to={`/staff/products/edit/${product.id}`}
              state={{ product }}
              className="edit-btn"
            >
              Edit
            </Link>
            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          </div>
        ) : (
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );

  return isStaffPanel ? (
    cardContent
  ) : (
    <Link to={`/product/description/${id}`} className="product-card-link">
      {cardContent}
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    isOnSale: PropTypes.bool,
    discountPercentage: PropTypes.number,
    spec: PropTypes.object,
  }).isRequired,
  isStaffPanel: PropTypes.bool,
  onDelete: PropTypes.func,
  id: PropTypes.number.isRequired,
};

export default ProductCard;