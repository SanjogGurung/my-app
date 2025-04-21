import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faUpload, faSpinner, faUser, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { updateUser } from '../redux/slices/authSlice';
import { fetchOrders } from '../redux/slices/orderSlice';
import Alert from '../components/Alert';
import '../styles/UserProfile.css';

export default function UserProfile() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { orders, isLoading: ordersLoading, error: ordersError } = useSelector((state) => state.orders);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImgSrc, setProfileImgSrc] = useState(null);
  const [LoadingImg, setLoadingImg] = useState(true);
  const [imageError, setImageError] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
        if (user && user.id && token) {
            setLoadingImg(true);
            setImageError(null);
            try {
                const response = await fetch(`http://localhost:8082/user/${user.id}/image`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const blob = await response.blob();
                    setProfileImgSrc(URL.createObjectURL(blob));
                } else if (response.status === 401 || response.status === 403) {
                    setImageError("Authentication failed to load image.");
                    // Optionally handle token expiration or redirect to login
                } else {
                    setImageError(`Failed to load image: ${response.statusText}`);
                }
            } catch (error) {
                console.error("Error fetching profile image:", error);
                setImageError("Error fetching image.");
            } finally {
                setLoadingImg(false);
            }
        }
  }; 
  fetchProfileImage(); 
}, [user?.id, token, user?.profileImg]);

  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    profileImg: '',
  });
  const [photo, setPhoto] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profileImg: user.profileImg || 'null',
      });
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated, token]);

  useEffect(() => {
    if (authError || ordersError) {
      setIsAlertOpen(true);
    }
  }, [authError, ordersError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    try {
      console.log("Working !!!");
      await dispatch(updateUser({ userData: formData, photo })).unwrap();  
      setIsEditing(false);
      setPhoto(null);
    } catch (err) {
      setIsAlertOpen(true);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  if (!isAuthenticated || !user) {
    return <p className="no-auth">Please log in to view your profile.</p>;
  }

  return (
    <div className="user-profile">
      <h1 className="profile-title">User Profile</h1>
      <div className="profile-content">
        <div className="photo-section">
          <div className="photo-container">
            {profileImgSrc ? (
              <img src={profileImgSrc} alt="Profile" className="profile-photo" />
            ) : (
              <FontAwesomeIcon icon={faUser} className="profile-placeholder" />
            )}
          </div>
          {isEditing && (
            <label className="photo-upload">
              <FontAwesomeIcon icon={faUpload} /> Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />
            </label>
          )}
        </div>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={true}
              className="form-input"
            />
          </div>
          <button type="submit" className="form-button">
            <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
            {isEditing ? ' Save' : ' Edit'}
          </button>
        </form>
      </div>
      <h2 className="orders-title">Order History</h2>
      {ordersLoading ? (
        <div className="loading">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </div>
      ) : orders.length > 0 ? (
        <div className="orders-table">
          <div className="table-header">
            <span>Order ID</span>
            <span>Date</span>
            <span>Total</span>
            <span>Status</span>
            <span></span>
          </div>
          {orders.map((order) => (
            <div key={order.orderId} className="table-row-wrapper">
              <div className="table-row" onClick={() => toggleOrderDetails(order.orderId)}>
                <span>{order.orderId}</span>
                <span>{new Date(order.date).toLocaleDateString()}</span>
                <span>${order.total.toFixed(2)}</span>
                <span>{order.status}</span>
                <span>
                  <FontAwesomeIcon
                    icon={expandedOrder === order.orderId ? faChevronUp : faChevronDown}
                    className="toggle-icon"
                  />
                </span>
              </div>
              {expandedOrder === order.orderId && order.items && order.items.length > 0 && (
                <div className="order-items">
                  <div className="items-header">
                    <span>Product</span>
                    <span>Quantity</span>
                    <span>Price</span>
                  </div>
                  {order.items.map((item) => (
                    <div key={item.productId} className="items-row">
                      <span>{item.name}</span>
                      <span>{item.quantity}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-orders">No orders found.</p>
      )}
      <Alert isOpen={isAlertOpen} onClose={closeAlert}>
        <div>
          <p>Profile Error</p>
          <p>{authError || ordersError || 'An error occurred.'}</p>
        </div>
      </Alert>
    </div>
  );
}
