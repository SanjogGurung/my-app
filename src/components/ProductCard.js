import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../redux/slices/cartSlice";
import "../styles/ProductCard.css";
import debounce from 'lodash.debounce';

const ProductCard = ({
  product,
  isStaffPanel = false,
  onDelete,
  id
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const discountedPrice =
    product.isOnSale && product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;

  const handleDelete = async (e) => {
    e.preventDefault();
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

  const debouncedAddToCart = useCallback(
    debounce((item) => {
      console.log('Dispatching addItemToCart with:', item);
      dispatch(addItemToCart(item));
      alert(`Product ${product.name} added successfully`);

    }, 300),
    [dispatch]
  );

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Still a good practice on the button itself
    if (isAuthenticated) {
      const item = {
        productId: product.id,
        productName: product.name,
        price: product.isOnSale && product.discountPercentage ? product.discountedPrice : product.price,
        quantity: 1,
      };
      debouncedAddToCart(item);
    } else {
      navigate('/login');
    }
  };

  const handleCardClick = (event) => {
    // Check if the clicked element has the class 'add-to-cart-btn' or 'delete-btn'
    if (!event.target.classList.contains('add-to-cart-btn') &&
        !event.target.classList.contains('delete-btn') &&
        !event.target.closest('.staff-actions')) { // Prevent navigation when clicking staff actions
      navigate(`/product/description/${id}`);
    }
  };

  const cardContent = (
    <div className="product-card-content">
      {product.isOnSale && <div className="sale-badge">Sale</div>}
      <div className="product-image">
        <img src={`http://localhost:8082/product/${id}/image/1`} alt={product.name} />
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <div className="price-container">
          {product.isOnSale && product.discountPercentage > 0 ? (
            <p className="product-price on-sale">
              <span className="original-price">${product.price.toFixed(2)}</span>
              <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
            </p>
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
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="product-card-link-wrapper" onClick={handleCardClick}>
      {cardContent}
    </div>
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