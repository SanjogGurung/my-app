import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart, incrementItemQuantity, removeItemFromCart, deleteItemFromCart } from "../redux/slices/cartSlice";
import "../styles/CartPage.css";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalPrice, isLoading, error } = useSelector((state) => state.cart);
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);


  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleIncrementQuantity = async (id) => {
    try {
      await dispatch(incrementItemQuantity(id)).unwrap();
    } catch (err) {
      alert("Failed to increment quantity.");
    }
  };

  const handleDecrementQuantity = async (id) => {
    try {
      await dispatch(removeItemFromCart(id)).unwrap();
    } catch (err) {
      alert("Failed to decrement quantity.");
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to remove this item entirely?")) {
      try {
        await dispatch(deleteItemFromCart(id)).unwrap();
      } catch (err) {
        alert("Failed to delete item.");
      }
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Cart is empty. Add items before checking out.");
      return;
    }
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return <div className="cart-loading">Loading cart...</div>;
  }

  if (error) {
    return <div className="cart-error">Error: {error}</div>;
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-left">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            <span>{totalQuantity} Items</span>
          </div>
          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            <>
              <div className="cart-items-header">
                <span>PRODUCT DETAILS</span>
                <span>QUANTITY</span>
                <span>PRICE</span>
                <span>TOTAL</span>
              </div>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-details">
                      <img
                        src={`http://localhost:8082/product/${item.productId}/image/1`} // Replace with item.imageUrl if available
                        alt={item.productName}
                        className="cart-item-image"
                      />
                      <div className="cart-item-info">
                        <h2>{item.productName}</h2>
                        <p>PS4</p>
                        <button
                          className="remove-btn"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        onClick={() => handleDecrementQuantity(item.id)}
                      >
                        −
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleIncrementQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-price">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="continue-shopping"
                onClick={handleContinueShopping}
              >
                ← Continue Shopping
              </button>
            </>
          )}
        </div>
        <div className="cart-right">
          <h1>Order Summary</h1>
          <div className="order-summary-total">
            <span>TOTAL COST</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
