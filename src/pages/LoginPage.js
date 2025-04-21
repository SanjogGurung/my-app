import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import Alert from '../components/Alert';
import '../styles/RegistrationForm.css';
import ThinkingPerson from '../assets/Person-Thinking.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  console.log('LoginPage: isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user, 'location.pathname:', location.pathname, 'location.state:', location.state);

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formMessage, setFormMessage] = useState({
    emailMessage: '',
    passwordMessage: '',
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (isLoading) {
      console.log('LoginPage: Waiting for auth initialization');
      return;
    }

    if (isAuthenticated && user) {
      console.log('LoginPage: Role:', user.role);
      const currentPath = location.pathname;
      const validPaths = ['/profile', '/cart', '/staff', '/admin-panel'];
      const fromPath = location.state?.from?.pathname || '/home';

      if (validPaths.includes(currentPath)) {
        console.log('LoginPage: On valid path, no redirect needed:', currentPath);
        return;
      }

      if (validPaths.includes(fromPath)) {
        console.log('LoginPage: Redirecting to original path:', fromPath);
        navigate(fromPath, { replace: true });
      } else {
        const role = user.role.toLowerCase();
        if (role === 'admin') {
          console.log('LoginPage: Redirecting to /admin-panel');
          navigate('/admin-panel', { replace: true });
        } else if (role === 'staff') {
          console.log('LoginPage: Redirecting to /staff');
          navigate('/staff', { replace: true });
        } else if (role === 'user') {
          console.log('LoginPage: Redirecting to /home');
          navigate('/home', { replace: true });
        } else {
          console.log('LoginPage: Unknown role, redirecting to /home');
          navigate('/home', { replace: true });
        }
      }
    }
    if (error) {
      setIsAlertOpen(true);
    }
  }, [isAuthenticated, user, error, navigate, location, isLoading]);

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    let message = '';
    if (name === 'email') {
      message = validateEmail(value) ? '' : 'Please enter a valid Email';
    } else if (name === 'password') {
      message = value.trim() ? '' : 'Please enter your Password';
    }
    setFormMessage({ ...formMessage, [`${name}Message`]: message });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateEmail(formData.email)) {
      setFormMessage({ ...formMessage, emailMessage: 'Please enter a valid Email' });
      return;
    }
    if (!formData.password.trim()) {
      setFormMessage({ ...formMessage, passwordMessage: 'Please enter your Password' });
      return;
    }

    await dispatch(login(formData));
  }

  function closeAlert() {
    console.log('LoginPage: Closing alert');
    setIsAlertOpen(false);
  }

  if (isLoading) {
    console.log('LoginPage: Waiting for auth initialization');
    return <div className="loading-spinner">Loading...</div>;
  }

  if (isAuthenticated && user) {
    console.log('LoginPage: Already authenticated, skipping form render');
    return null;
  }

  console.log('LoginPage: Rendering login form');
  return (
    <div className="register-page">
      <div className="register">
        <div className="left-side">
          <div className="person-thinking">
            <img src={ThinkingPerson} alt="Person Thinking" className="thinking-person" />
          </div>
          <div className="branding">
            <div className="logo-register">SuSankhya</div>
            <div className="description">
              <i>Online mobile selling with the best quality and deals</i>
            </div>
          </div>
        </div>
        <div className="right-side">
          <h1 className="form-title">Login</h1>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  aria-describedby="email-error"
                />
                <em id="email-error">{formMessage.emailMessage}</em>
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

            <div className="form-row submit-row">
              <Button
                type="submit"
                className="submit-button"
                disabled={isLoading}
                aria-label={isLoading ? 'Logging in' : 'Login'}
              >
                {isLoading ? <Spinner ariaLabel="Logging in" /> : 'Login'}
              </Button>
            </div>
          </form>
          <p className="login-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
      <Alert isOpen={isAlertOpen} onClose={closeAlert}>
        <div>
          <p>Login Failed</p>
          <p>{error || 'Please check your credentials and try again.'}</p>
        </div>
      </Alert>
    </div>
  );
}

export default LoginPage;