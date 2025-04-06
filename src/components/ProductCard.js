import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../styles/ProductCard.css";

const ProductCard = ({
  image,
  name,
  price,
  id, 
  isOnSale = false,
  discountPercentage = 0,
  isStaffPanel = false,
  onEdit,
  onDelete
}) => {
  const discountedPrice =
    isOnSale && discountPercentage > 0
      ? price * (1 - discountPercentage / 100)
      : price;


  // Handle Add to Cart (customer view)
  const handleAddToCart = () => {
    // Add to cart logic (e.g., Redux, API call)
    console.log(`Added ${name} to cart`);
    alert(`${name} added to cart!`);
  };

  return (
    <div className="product-card">
      {isOnSale && <div className="sale-badge">Sale</div>}
      <div className="product-image">
        <img src={image} alt={name} />
      </div>
      <div className="product-details">
        <h3 className="product-name">{name}</h3>
        <div className="price-container">
          {isOnSale && discountPercentage > 0 ? (
            <>
              <p className="product-price original-price">${price.toFixed(2)}</p>
              <p className="product-price discounted-price">${discountedPrice.toFixed(2)}</p>
            </>
          ) : (
            <p className="product-price">${price.toFixed(2)}</p>
          )}
        </div>
        {isOnSale && discountPercentage > 0 && (
          <p className="discount-info">Save {discountPercentage}%</p>
        )}
        {isStaffPanel ? (
          <div className="staff-actions">
            <button
              className="edit-btn"
              onClick={() => onEdit({ id, name, price, image, isOnSale, discountPercentage })}
            >
              Edit
            </button>
            <button className="delete-btn" onClick={() => onDelete(id)}>
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
};

// PropTypes for type checking
ProductCard.propTypes = {
  id: PropTypes.number, // Required for staff actions
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  isOnSale: PropTypes.bool,
  discountPercentage: PropTypes.number,
  isStaffPanel: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

ProductCard.defaultProps = {
  isOnSale: false,
  discountPercentage: 0,
  isStaffPanel: false,
  onEdit: () => {},
  onDelete: () => {},
};

export default ProductCard;