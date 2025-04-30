import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder, clearOrderError } from '../redux/slices/orderSlice';
import '../styles/Checkout.css';

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, token, user, isLoading: authLoading } = useSelector((state) => state.auth);
    const { status: orderStatus, error: orderError } = useSelector((state) => state.order);
    const cart = useSelector((state) => state.cart);
    const [formData, setFormData] = useState({
        shippingAddress: '',
        phoneNumber: '',
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !user || !token) {
            navigate('/login');
        }
        dispatch(clearOrderError());
    }, [isAuthenticated, user, token, navigate, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const calculateTotal = () => {
        return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        let errors = [];
        if (!formData.shippingAddress) {
            errors.push("Shipping address is required.");
        }
        if (!formData.phoneNumber) {
            errors.push("Phone number is required.");
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            errors.push("Phone number must be exactly 10 digits.");
        }

        if (errors.length > 0) {
            setError(errors.join(" "));
            setIsSubmitting(false);
            return;
        }

        try {
            const totalAmount = calculateTotal() * 100; // Convert to paisa
            console.log('Submitting order with:', { shippingAddress: formData.shippingAddress, phoneNumber: formData.phoneNumber, totalAmount });
            const result = await dispatch(placeOrder({
                shippingAddress: formData.shippingAddress,
                phoneNumber: formData.phoneNumber,
                totalAmount: totalAmount
            })).unwrap();

            console.log('Order placement result:', result);
            const { payment_url } = result;
            if (payment_url) {
                console.log('Redirecting to Khalti portal:', payment_url);
                window.location.href = payment_url;
            } else {
                throw new Error('Failed to initiate payment: No payment URL received from Khalti.');
            }
        } catch (err) {
            console.error('Error during order placement:', err);
            const errorMessage = orderError || err.message || 'Failed to initiate payment with Khalti. Please try again or contact support.';
            if (errorMessage.includes('Khalti')) {
                setError('Khalti payment service is currently unavailable. Please try again later.');
            } else {
                setError(errorMessage);
            }
            setIsSubmitting(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        dispatch(clearOrderError());
    };

    const handleCancel = () => {
        navigate('/cart');
    };

    if (authLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <div className="checkout-content">
                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    {cart.items.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <>
                            <div className="cart-items-header">
                                <span>PRODUCT DETAILS</span>
                                <span>QUANTITY</span>
                                <span>PRICE</span>
                                <span>TOTAL</span>
                            </div>
                            <div className="cart-items">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item-details">
                                            <img
                                                src={`http://localhost:8082/product/${item.productId}/image/1`}
                                                alt={item.productName || 'Product Image'}
                                                className="cart-item-image"
                                                onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                                            />
                                            <div className="cart-item-info">
                                                <h2>{item.productName || 'Unknown Product'}</h2>
                                            </div>
                                        </div>
                                        <div className="quantity">
                                            <span>{item.quantity || 0}</span>
                                        </div>
                                        <div className="cart-item-price">
                                            NPR {item.price ? item.price.toFixed(2) : '0.00'}
                                        </div>
                                        <div className="cart-item-total">
                                            NPR {(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="cart-total">
                                <strong>Total:</strong> NPR {calculateTotal().toFixed(2)}
                            </div>
                        </>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="checkout-form">
                    <h2>Shipping Details</h2>
                    <div className="form-group">
                        <label htmlFor="shippingAddress">Shipping Address</label>
                        <textarea
                            id="shippingAddress"
                            name="shippingAddress"
                            value={formData.shippingAddress}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Payment Method</label>
                        <p className="payment-method">Khalti</p>
                    </div>
                    {error && (
                        <div className="error">
                            <p>{error}</p>
                            <div className="error-actions">
                                <button type="button" onClick={handleRetry}>Retry</button>
                                <button type="button" onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="place-order-button"
                        disabled={orderStatus === 'loading' || cart.items.length === 0 || isSubmitting}
                    >
                        {isSubmitting || orderStatus === 'loading' ? 'Processing...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Checkout;