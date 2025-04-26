import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../axiosConfig';
import { fetchOrders } from '../redux/slices/orderSlice';

function CheckoutVerify() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, token } = useSelector((state) => state.auth);
    const [message, setMessage] = useState('Verifying payment...');
    const hasVerified = useRef(false); // Prevent multiple verification calls

    useEffect(() => {
        const verifyPayment = async () => {
            if (hasVerified.current) {
                console.log('Verification already attempted, skipping...');
                return;
            }

            hasVerified.current = true;

            if (!isAuthenticated || !token) {
                navigate('/login');
                return;
            }

            const params = new URLSearchParams(location.search);
            const pidx = params.get('pidx');
            const status = params.get('status');
            const transactionId = params.get('transaction_id');

            if (!pidx) {
                setMessage('Invalid payment verification request.');
                return;
            }

            try {
                console.log('Verifying payment with pidx:', pidx, 'status:', status, 'transaction_id:', transactionId);
                const response = await axios.post(
                    `http://localhost:8082/order/verify-payment`,
                    {}, // Empty body, since parameters are sent as query params
                    {
                        params: { pidx, status, transaction_id: transactionId },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log('Payment verification response:', response.data);
                if (response.data.status === 'success') {
                    await dispatch(fetchOrders()).unwrap();
                    setMessage('Payment successful! Redirecting to profile...');
                    setTimeout(() => navigate('/profile'), 2000);
                } else {
                    setMessage(response.data.error || 'Payment verification failed. Redirecting to cart...');
                    setTimeout(() => navigate('/cart'), 2000);
                }
            } catch (err) {
                console.error('Payment verification failed:', err.response?.status, err.response?.data, err.message);
                setMessage('Payment verification failed: ' + (err.response?.data?.error || err.message) + '. Redirecting to cart...');
                setTimeout(() => navigate('/cart'), 2000);
            }
        };

        verifyPayment();
    }, [isAuthenticated, token, location, navigate, dispatch]);

    return (
        <div className="checkout-page">
            <h1>Payment Verification</h1>
            <p>{message}</p>
        </div>
    );
}

export default CheckoutVerify;