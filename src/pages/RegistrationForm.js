import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegistrationForm.css'
import personThinkg from '../assets/Person-Thinking.png'
import Button from '../components/Button'
import Alert from '../components/Alert'

export default function RegistrationForm() {
    const navigate = useNavigate();

    const [ isPhoneNumberAlertOpen, setPhoneNumberAlert ] = useState(false);

    function closePhoneNumberAlert() {
        setPhoneNumberAlert(false);
    }

    const [isAlertOpen, setAlertOpen] = useState(false);
    
    function closeAlert() {
        setAlertOpen(false);
    }

    const [passwordStrength, setPasswordStrength] = useState({
        length : false,
        uppercase : false,
        lowercase : false, 
        number : false, 
        speacialCharacters : false
    });
    const [ formData, setFormData ] = useState({
        firstName : "",
        lastName : "",
        email : "",
        password : "",
        phoneNumber : ""
    });
    const [ formMessage, setFormMessage ] = useState({
        firstNameMessage : "Please enter your First Name",
        lastNameMessage : "Please enter your Last Name",
        emailMessage : "Please enter your Email",
        passwordMessage : "Please enter your Password",
        phoneNumberMessage : "Please enter your Phone Number"
    });

    // Password Strength Validation Function
    function validatePasswordStrength(password) {
        const strength = {
            length : password.length > 7,
            uppercase : /[A-Z]/.test(password),
            lowercase : /[a-z]/.test(password),
            number : /[0-9]/.test(password),
            speacialCharacters : /[!@#$%^&*]/.test(password)
        };
        setPasswordStrength(strength);
        return Object.values(strength).every((rule) => rule); // returns true if all the critera are met
    }
    // Email Validation Function 
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    // Phone Number Validation
    function validatePhoneNumber(phoneNumber) {
        return /^\d{10}$/.test(phoneNumber);
    }

    // Handle Input Changes
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData(
            { ...formData, [name] : value }
        ); 

        let message = "";
        // Validate Forms Dynamically
        switch (name) {
            case 'firstName':
                message = value.trim() ? '' : 'Please enter your First Name';
                break;

            case 'lastName':
                message = value.trim() ? '' : 'Please enter your Last Name';
                break;
                
            case 'email':
                message = value.trim() ? '' : 'Please enter your Email';
                break;
            
            case "password":
                validatePasswordStrength(value);
                message = value.trim() ? '' : 'Please enter your password';
                break;
                
            case 'phoneNumber':
                message = validatePhoneNumber(value) ? '' : 'Phone Number must be exactly 10 digits';
                break;
            default:
                break;
        } 
        setFormMessage({ ...formMessage, [`${name}Message`]: message });  
    }

    async function submitForm(e) {
        e.preventDefault();
        
        if(!validatePasswordStrength(formData.password)) {
            setAlertOpen(true);
            return;
        }

        if(!validatePhoneNumber(formData.phoneNumber)) {
            setPhoneNumberAlert(true);
            return;
        }
        
        // Submit form data
        const payload = { ...formData };
        try {
            const response = await fetch("http://localhost:8081/user/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log("Backend error:", errorData);
                alert("Registration failed. Please try again.");
                return;
            }

            console.log("User registered successfully!");
            // Redirect to the verification page
            navigate("/verify-email");
        } catch (error) {
            console.error("Network error:", error);
            alert("Registration failed. Please check your network connection.");
        }
    }
    
    return (
        <div className="root"> 
        <div className="left-side">
            <div className="person-thinking"> 
                <img src={personThinkg} width="60px" alt="Person Thinking" />
            </div>
            <div className="branding"> 
                <div className="logo">
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
                Sign Up
            </div>
            <form onSubmit={submitForm}> 
                <div className="first-row">
                    <div>
                        <p>First Name</p>
                        <input type="text" name="firstName" onChange={handleChange} required />
                        <em>{formMessage.firstNameMessage}</em>
                    </div>
                    <div>
                        <p>Last Name</p>
                        <input type="text" name="lastName" onChange={handleChange} required />
                        <em>{formMessage.lastNameMessage}</em>
                    </div>
                </div>

                <div className="first-row"> 
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
                    <div>
                        <p>Phone Number</p>
                        <input type="text" name="phoneNumber" onChange={handleChange} required />
                        <em>{formMessage.phoneNumberMessage}</em>
                    </div>
                </div>

                <div className="first-row"> 
                        <button type = "submit" className='submit-button'>Sign up</button>
                </div>
            </form>
        </div>

        <Alert
            isOpen={isAlertOpen}
            onClose={closeAlert}
        >
            <PasswordStrengthMessage strength={passwordStrength} />
        </Alert>

        <Alert
            isOpen={isPhoneNumberAlertOpen}
            onClose={closePhoneNumberAlert}
        >
            <div>
                <p>Phone Number Alert</p>
                <l>Phone number must be integer and no other characters.</l>
            </div>
        </Alert>

    </div>
    )
}

// Password Strength Message Compon ent
function PasswordStrengthMessage( {strength} ) {
    return (
        <div className = "password-message">
            <p>Password must contain: </p>
            <ul>
                <li>
                    At least 8 characters {strength.length ? '✓' : ""}
                </li>
                <li>
                    At least 1 character should be uppercase {strength.uppercase ? '✓' : ""}
                </li>
                <li>
                    At least 1 character should be lowercase {strength.lowercase ? '✓' : ''}
                </li>
                <li>
                    At least 1 character should be a number {strength.number ? '✓' : ''}
                </li>
                <li>
                    At least 1 character should be special character {strength.speacialCharacters ? '✓' : ''}
                </li>
            </ul>       
        </div>
    )
}
        