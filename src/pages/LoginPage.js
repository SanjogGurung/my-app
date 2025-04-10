import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegistrationForm.css'
import personThinkg from '../assets/Person-Thinking.png'
import Button from '../components/Button'
import Alert from '../components/Alert'
import Navbar from '../components/Navbar';

export default function LoginPage() {
    const navigate = useNavigate();

    const [isAlertOpen, setAlertOpen] = useState(false);
    
    function closeAlert() {
        setAlertOpen(false);
    }

    const [ formData, setFormData ] = useState({
        email : "",
        password : "",
    });

    const [ formMessage, setFormMessage ] = useState({
        emailMessage : "Please enter your Email",
        passwordMessage : "Please enter your Password",
    });

    // Handle Input Changes
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData(
            { ...formData, [name] : value }
        ); 

        let message = "";

        // Validate Forms Dynamically
        switch (name) {
            case 'email':
                message = value.trim() ? '' : 'Please enter your Email';
                break;
            
            case "password":
                message = value.trim() ? '' : 'Please enter your password';
                break;

            default:
                break;
        } 
        setFormMessage({ ...formMessage, [`${name}Message`]: message });  
    }

    async function submitForm(e) {
        e.preventDefault();

        // Submit form data
        const payload = { ...formData };
        try {
            const response = await fetch("http://localhost:8081/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log("Backend error:", errorData);
                alert("Login failed. Please try again.");
                return;
            }

            console.log("User logged in successfully!");

        } catch (error) {
            console.error("Network error:", error);
            alert("Registration failed. Please check your network connection.");
        }
    }
    
    return (
        <div className="register">
            <div className="left-side">
                <div className="person-thinking"> 
                    <img src={personThinkg} width="60px" alt="Person Thinking" />
                </div>
                <div className="branding"> 
                    <div className="logo-register">
                        SuSankhya
                    </div>
                    <div className="description"> 
                        <i>
                            is an online mobile selling website where you can buy mobiles with best quality and deals
                        </i>
                    </div>
                </div>
            </div>

            <div className="right-side"> 
                <div className = "form-title">
                    Sign In
                </div>
                <form onSubmit={submitForm}> 
                    <div className="first-row" style={{flexDirection : "column"}}> 
                        <div>
                            <p>Email</p>
                            <input type="email" name="email" onChange={handleChange} required />
                            <em>{formMessage.emailMessage}</em>
                        </div>
                        <div>
                            <p>Password</p>
                            <input type="password" name="password" onChange={handleChange} required />
                            <em>{formMessage.passwordMessage}</em>
                        </div>
                    </div>

                    <div className="first-row"> 
                            <button type = "submit" className='submit-button'>Sign In</button>
                    </div>
                </form>
            </div>
    </div>
    )
}

        