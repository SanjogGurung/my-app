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

  // Debugging to check if the badge should be displayed
  console.log(`Product: ${product.name}`, {
    isOnSale: product.isOnSale,
    discountPercentage: product.discountPercentage,
    originalPrice: product.price,
    discountedPrice: discountedPrice
  });

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
      dispatch(addItemToCart(item))
        .unwrap()
        .then((fulfilledValue) => {
          console.log('addItemToCart successful:', fulfilledValue);
          alert(`Product ${product.name} added successfully`);
        })
        .catch((rejectedValue) => {
          console.error('addItemToCart failed:', rejectedValue);
          alert(`Failed to add product ${product.name} to cart. Please try again.`);
        });
    }, 300),
    [dispatch, product.name]
  );

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isAuthenticated) {
      const item = {
        productId: product.id,
        productName: product.name,
        price: product.isOnSale && product.discountPercentage ? discountedPrice : product.price,
        quantity: 1,
      };
      debouncedAddToCart(item);
    } else {
      navigate('/login');
    }
  };

  const handleCardClick = (event) => {
    if (!event.target.classList.contains('pc-add-to-cart-btn') &&
        !event.target.classList.contains('pc-delete-btn') &&
        !event.target.closest('.pc-staff-actions')) {
      navigate(`/product/description/${id}`);
    }
  };

  const cardContent = (
    <div className="pc-product-card-content">
      {product.isOnSale && product.discountPercentage > 0 && (
        <div className="pc-sale-badge">{Math.round(product.discountPercentage)}% Off</div>
      )}
      <div className="pc-product-image">
        <img src={`http://localhost:8082/product/${id}/image/1`} alt={product.name} />
      </div>
      <div className="pc-product-details">
        <h3 className="pc-product-name">{product.name}</h3>
        <div className="pc-price-container">
          {product.isOnSale && product.discountPercentage > 0 ? (
            <p className="pc-product-price pc-on-sale">
              <span className="pc-original-price">NPR {product.price.toFixed(2)}</span>
              <span className="pc-discounted-price">NPR {discountedPrice.toFixed(2)}</span>
            </p>
          ) : (
            <p className="pc-product-price">NPR {product.price.toFixed(2)}</p>
          )}
        </div>
        {isStaffPanel ? (
          <div className="pc-staff-actions">
            <Link
              to={`/staff/products/edit/${product.id}`}
              state={{ product }}
              className="pc-edit-btn"
            >
              Edit
            </Link>
            <button className="pc-delete-btn" onClick={handleDelete}>
              Delete
            </button>
          </div>
        ) : (
          <button
            className="pc-add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`pc-product-card-link-wrapper ${isStaffPanel ? 'pc-staff-card' : 'pc-user-card'}`} onClick={handleCardClick}>
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