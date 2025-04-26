import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import '../styles/Checkout.css';

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, token, user, isLoading: authLoading } = useSelector((state) => state.auth);
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
    }, [isAuthenticated, user, token, navigate]);

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

        // Validate inputs
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
            // Prepare form data
            const formDataToSend = new URLSearchParams();
            formDataToSend.append("shippingAddress", formData.shippingAddress);
            formDataToSend.append("phoneNumber", formData.phoneNumber);

            const response = await axios.post('http://localhost:8082/order/initiate-payment', formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const { payment_url } = response.data;
            if (payment_url) {
                window.location.href = payment_url;
            } else {
                throw new Error('Failed to initiate payment: No payment URL received.');
            }
        } catch (err) {
            console.error('Error initializing payment:', err.response?.status, err.response?.data);
            const errorMessage = err.response?.data?.error || err.message || 'Failed to initiate payment';
            setError(errorMessage);
            setIsSubmitting(false);
        }
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
                                                onError={(e) => (e.target.src = '/placeholder-image.jpg')} // Fallback image
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
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="place-order-button" disabled={isSubmitting || cart.items.length === 0}>
                        {isSubmitting ? 'Processing...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Checkout;