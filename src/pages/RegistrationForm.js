import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import '../styles/RegistrationForm.css';
import personThinking from '../assets/Person-Thinking.png';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [isPhoneNumberAlertOpen, setPhoneNumberAlert] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialCharacters: false,
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [formMessage, setFormMessage] = useState({
    firstNameMessage: 'Please enter your First Name',
    lastNameMessage: 'Please enter your Last Name',
    emailMessage: 'Please enter your Email',
    passwordMessage: 'Please enter your Password',
    phoneNumberMessage: 'Please enter your Phone Number',
  });

  function closePhoneNumberAlert() {
    setPhoneNumberAlert(false);
  }

  function closeAlert() {
    setAlertOpen(false);
  }

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  function validatePasswordStrength(password) {
    const strength = {
      length: password.length > 7,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialCharacters: /[!@#$%^&*]/.test(password),
    };
    setPasswordStrength(strength);
    return Object.values(strength).every((rule) => rule);
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePhoneNumber(phoneNumber) {
    return /^\d{10}$/.test(phoneNumber);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    let message = '';
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
      case 'password':
        validatePasswordStrength(value);
        message = value.trim() ? '' : 'Please enter your Password';
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
    if (!validatePasswordStrength(formData.password)) {
      setAlertOpen(true);
      return;
    }
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setPhoneNumberAlert(true);
      return;
    }
    if (!validateEmail(formData.email)) {
      navigate('/verify-email?status=error');
      return;
    }
    setIsLoading(true); // Start loading
    const payload = { ...formData };
    try {
      const response = await fetch('http://localhost:8082/user/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          navigate('/verify-email?status=exists');
          return;
        }
        console.log('Backend error:', await response.json());
        navigate('/verify-email?status=error');
        return;
      }
      navigate('/verify-email?status=success');
    } catch (error) {
      navigate('/verify-email?status=error');
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  return (
    <div className="register-page">
      <div className="register">
        <div className="left-side">
          <div className="person-thinking">
            <img src={personThinking} width="80px" alt="Person Thinking" />
          </div>
          <div className="branding">
            <div className="logo-register">SuSankhya</div>
            <div className="description">
              <i>Online mobile selling with the best quality and deals</i>
            </div>
          </div>
        </div>

        <div className="right-side">
          <div className="form-title">Sign Up</div>
          <form className="register-form" onSubmit={submitForm}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" onChange={handleChange} required />
                <em>{formMessage.firstNameMessage}</em>
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" onChange={handleChange} required />
                <em>{formMessage.lastNameMessage}</em>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" onChange={handleChange} required />
                <em>{formMessage.emailMessage}</em>
              </div>
              <div className="form-group password-container">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    onChange={handleChange}
                    required
                    className="password-input"
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="password-toggle-icon"
                    onClick={togglePasswordVisibility}
                    aria-label="Toggle password visibility"
                  />
                </div>
                <em>{formMessage.passwordMessage}</em>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phoneNumber" onChange={handleChange} required />
                <em>{formMessage.phoneNumberMessage}</em>
              </div>
            </div>
            <div className="form-row submit-row">
              <Button
                type="submit"
                className="submit-button"
                disabled={isLoading}
                aria-label={isLoading ? 'Submitting registration' : 'Sign Up'}
              >
                {isLoading ? (
                  <Spinner ariaLabel="Submitting registration" />
                ) : (
                  'Sign Up'
                )}
              </Button>
            </div>
          </form>
          <div className="login-link">
            <p>
              If already registered,{' '}
              <Link to="/login" aria-label="Navigate to login page">
                click here
              </Link>
            </p>
          </div>
        </div>

        <Alert isOpen={isAlertOpen} onClose={closeAlert}>
          <div className="password-message">
            <p>Password must contain:</p>
            <ul>
              <li>At least 8 characters {passwordStrength.length ? '✓' : ''}</li>
              <li>At least 1 uppercase letter {passwordStrength.uppercase ? '✓' : ''}</li>
              <li>At least 1 lowercase letter {passwordStrength.lowercase ? '✓' : ''}</li>
              <li>At least 1 number {passwordStrength.number ? '✓' : ''}</li>
              <li>At least 1 special character {passwordStrength.specialCharacters ? '✓' : ''}</li>
            </ul>
          </div>
        </Alert>
        <Alert isOpen={isPhoneNumberAlertOpen} onClose={closePhoneNumberAlert}>
          <div>
            <p>Phone Number Alert</p>
            <p>Phone number must be exactly 10 digits with no other characters.</p>
          </div>
        </Alert>
      </div>
    </div>
  );
}