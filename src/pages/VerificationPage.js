import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner.js';
import '../styles/VerificationPage.css';

function VerificationPage() {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  useEffect(() => {
    console.log('VerificationPage useEffect called');
    if (hasVerified.current) {
      console.log('Skipping duplicate useEffect');
      return;
    }
    hasVerified.current = true;

    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    const token = queryParams.get('token');

    console.log('Query params:', { status, token });

    if (status === 'success') {
      setMessage('Please check your email');
      setIsError(false);
      setIsLoading(false);
    }else if (status === 'exists') {
      setMessage('Email already exists');
      setIsError(true);
      setIsLoading (false);
    } else if (status === 'error') {
      setMessage('Please send valid email address');
      setIsError(true);
      setIsLoading(false);
    }  else if (!token && !status) {
      setMessage('No verification token or status found.');
      setIsError(true);
      setIsLoading(false);
    } else if (token) {
      verifyEmailToken(token);
    }

    return () => {
      console.log('VerificationPage useEffect cleanup');
    };
  }, [location]);

  async function verifyEmailToken(token) {
    setIsLoading(true);
    try {
      console.log('Verifying token:', token);
      const response = await fetch(`http://localhost:8082/verify-email/${token}`);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setMessage(data.message || 'Email verified successfully!');
        setIsError(false);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(data.message || 'Invalid or expired token.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setMessage('An error occurred while verifying your email.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="verification-page">
      <div className="verification-container">
        <div className="verification-card">
          <h1 className="verification-title">Email Verification</h1>
          {isLoading ? (
            <Spinner ariaLabel="Loading verification" />
          ) : (
            <p
              className={isError ? 'message-error' : 'message-success'}
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerificationPage;