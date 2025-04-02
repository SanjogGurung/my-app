import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
function VerificationPage() {
    const [message, setMessage] = useState("Please check your email for verification. ");
    const location = useLocation();

    useEffect(() => {

        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
            setMessage('No verification token found.');
            return;
        }

        verifyEmailToken(token);
    }, [location]);

    async function verifyEmailToken(token) {
        try {
            const response = await fetch(`http://localhost:8080/verify-email?token=${token}`);
            const data = await response.json();

            if (response.ok) {
                setMessage('Email has been verified successfully haiii !!!');
            } 
            else {
                setMessage('Invalid or Expired Verification Link !!!');
            } 
        }
        catch (error) {
            setMessage('An error occured while verifying your email !!!');
        }
    };

    return (
        <div>
            <h3>Email Verification</h3>
            <p>{message}</p>
        </div>
    );
}

export default VerificationPage;