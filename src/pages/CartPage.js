  // src/pages/CartPage.js
  import React, { useEffect } from "react";
  import { useSelector, useDispatch } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import {
    fetchCart,
    incrementItemQuantity,
    removeItemFromCart,
    deleteItemFromCart,
    clearCartItems,
    clearError,
  } from "../redux/slices/cartSlice";
  import { placeOrder, clearOrderError } from "../redux/slices/orderSlice";
  import "../styles/CartPage.css";

  const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalQuantity, totalPrice, isLoading, error } = useSelector((state) => state.cart);
    const orderState = useSelector((state) => state.order) || { status: 'idle', error: null };
    const { status: orderStatus, error: orderError } = orderState;
    const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
      dispatch(fetchCart());
    }, [dispatch]);

    const handleIncrementQuantity = async (id) => {
      console.log('Incrementing item with ID:', id);
      const item = items.find((item) => item.id === id);
      if (!item) {
        dispatch({ type: 'cart/incrementItemQuantity/rejected', payload: 'Item not found in cart.' });
        return;
      }
      console.log('Current quantity:', item.quantity);
      const newQuantity = item.quantity + 1;
      console.log('New quantity:', newQuantity);
      try {
        await dispatch(incrementItemQuantity({ id, quantity: newQuantity })).unwrap();
        await dispatch(fetchCart()); // Ensure state is refreshed
      } catch (err) {
        // Error is handled via state
      }
    };

    const handleDecrementQuantity = async (id) => {
      console.log('Decrementing item with ID:', id);
      const item = items.find((item) => item.id === id);
      if (!item) {
        dispatch({ type: 'cart/removeItemFromCart/rejected', payload: 'Item not found in cart.' });
        return;
      }
      console.log('Current quantity:', item.quantity);
      const newQuantity = item.quantity - 1;
      console.log('New quantity:', newQuantity);
      try {
        await dispatch(removeItemFromCart({ id, quantity: newQuantity })).unwrap();
        await dispatch(fetchCart()); // Ensure state is refreshed
      } catch (err) {
        // Error is handled via state
      }
    };

    const handleDeleteItem = async (id) => {
      if (window.confirm("Are you sure you want to remove this item entirely?")) {
        try {
          await dispatch(deleteItemFromCart(id)).unwrap();
          await dispatch(fetchCart()); // Already present in thunk, but ensure UI sync
        } catch (err) {
          // Error is handled via state
        }
      }
    };

    const handleCheckout = async () => {
      if (items.length === 0) {
        dispatch({ type: 'cart/placeOrder/rejected', payload: 'Cart is empty. Add items before checking out.' });
        alert("Cart is empty. Add items before checking out.");
        return;
      }
      try {
        navigate("/checkout");
      } catch (err) {
        // Error is handled via state
      }
    };

    const handleContinueShopping = () => {
      navigate("/products");
    };

    const handleClearError = () => {
      dispatch(clearError());
      dispatch(clearOrderError());
    };

    if (!isLoggedIn) {
      navigate("/login");
      return null;
    }

    if (isLoading || orderStatus === 'loading') {
      return <div className="cart-loading">Loading cart...</div>;
    }

    const displayError = error || orderError;
    const isStockError = displayError && displayError.includes("exceeds available stock");

    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-left">
            <div className="cart-header">
              <h1>Shopping Cart</h1>
              <span>{totalQuantity} Items</span>
            </div>
            {displayError && (
              <div className="cart-error">
                <p>Error: {displayError}</p>
                {isStockError && <p>Try reducing the quantity or removing items to proceed.</p>}
                <button onClick={handleClearError}>Clear Error</button>
              </div>
            )}
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
                          src={`http://localhost:8082/product/${item.productId}/image/1`}
                          alt={item.productName}
                          className="cart-item-image"
                        />
                        <div className="cart-item-info">
                          <h2>{item.productName}</h2>
                          <p>{item.brand}</p>
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
                          disabled={item.quantity <= 1}
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
                        NPR {item.price.toFixed(2)}
                      </div>
                      <div className="cart-item-total">
                        NPR {(item.price * item.quantity).toFixed(2)}
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