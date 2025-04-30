import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchOrders, verifyPayment, clearOrderError } from '../redux/slices/orderSlice';

function CheckoutVerify() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, token } = useSelector((state) => state.auth);
    const { status: orderStatus, error: orderError } = useSelector((state) => state.order);
    const [message, setMessage] = useState('Verifying your payment with Khalti...');
    const hasVerified = useRef(false);

    useEffect(() => {
        const verifyPaymentAction = async () => {
            if (hasVerified.current) {
                console.log('Verification already attempted, skipping...');
                return;
            }

            hasVerified.current = true;

            if (!isAuthenticated || !token) {
                setMessage('Please log in to verify your payment.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            const params = new URLSearchParams(location.search);
            const pidx = params.get('pidx');
            const status = params.get('status');
            const transactionId = params.get('transaction_id');

            if (!pidx) {
                setMessage('Invalid payment verification request: Missing payment ID.');
                setTimeout(() => navigate('/cart'), 3000);
                return;
            }

            try {
                const result = await dispatch(verifyPayment({ pidx, status, transactionId })).unwrap();
                if (result.status === 'success') {
                    await dispatch(fetchOrders()).unwrap();
                    setMessage('Payment successful! Your order has been placed. Redirecting to your profile...');
                    setTimeout(() => navigate('/profile'), 3000);
                } else {
                    setMessage(result.error || 'Payment verification failed. Redirecting to cart...');
                    setTimeout(() => navigate('/cart'), 3000);
                }
            } catch (err) {
                const errorMessage = orderError || 'Payment verification failed with Khalti. Please try again or contact support.';
                setMessage(errorMessage);
                setTimeout(() => navigate('/cart'), 3000);
                dispatch(clearOrderError());
            }
        };

        verifyPaymentAction();
    }, [isAuthenticated, token, location, navigate, dispatch, orderError]);

    return (
        <div className="checkout-page">
            <h1>Payment Verification</h1>
            <p>{message}</p>
            {orderStatus === 'loading' && <p>Loading...</p>}
            {orderError && <p className="error">{orderError}</p>}
        </div>
    );
}

export default CheckoutVerify;