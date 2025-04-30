import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faUpload, faSpinner, faUser, faChevronDown, faChevronUp, faSignOutAlt, faCircle } from '@fortawesome/free-solid-svg-icons';
import { updateUser, logout } from '../redux/slices/authSlice';
import { fetchOrders } from '../redux/slices/orderSlice';
import Alert from '../components/Alert';
import '../styles/UserProfile.css';
import axios from '../axiosConfig';

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { orders: rawOrders, isLoading: ordersLoading, error: ordersError } = useSelector((state) => state.order);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImgSrc, setProfileImgSrc] = useState(null);
  const [LoadingImg, setLoadingImg] = useState(true);
  const [imageError, setImageError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Sort orders by latest date
  const orders = [...rawOrders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user.id && token) {
        try {
          const response = await axios.get(`http://localhost:8082/user/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const fetchedUser = response.data;
          if (fetchedUser.role) {
            fetchedUser.role = fetchedUser.role.replace('ROLE_', '').toLowerCase();
          }
          setUserDetails(fetchedUser);
          console.log('Fetched user details:', fetchedUser);
        } catch (error) {
          console.error('Error fetching user details:', error.response?.status, error.response?.data);
          setFetchError(error.response?.data?.message || 'Failed to fetch user details');
        }
      }
    };
    fetchUserDetails();
  }, [user?.id, token]);

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
  }, [user?.id, token, userDetails?.profileImg]);

  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    profileImg: '',
  });
  const [photo, setPhoto] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (userDetails) {
      setFormData({
        id: userDetails.id || '',
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        email: userDetails.email || '',
        phoneNumber: userDetails.phoneNumber || '',
        profileImg: userDetails.profileImg || 'null',
      });
    }
  }, [userDetails]);

  useEffect(() => {
    if (isAuthenticated && token) {
      console.log('Fetching orders...');
      dispatch(fetchOrders()).then((result) => {
        if (fetchOrders.fulfilled.match(result)) {
          console.log('Orders fetched successfully:', result.payload);
        } else {
          console.error('Failed to fetch orders:', result.payload);
        }
      });
    }
  }, [dispatch, isAuthenticated, token]);

  useEffect(() => {
    if (authError || ordersError || fetchError) {
      setIsAlertOpen(true);
    }
  }, [authError, ordersError, fetchError]);

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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleOrderDetails = (orderId) => {
    console.log('Toggling order details for orderId:', orderId);
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
              required
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
              required
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
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="form-button">
              <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
              {isEditing ? ' Save' : ' Edit'}
            </button>
            <button type="button" className="form-button logout-button" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </button>
          </div>
        </form>
      </div>
      <h2 className="orders-title">Order History</h2>
      {ordersLoading ? (
        <div className="loading">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="orders-table">
          <div className="table-header">
            <span>Order ID</span>
            <span>Date</span>
            <span>Total</span>
            <span>Status</span>
            <span>Shipping Address</span>
            <span></span>
          </div>
          {orders.map((order) => (
            <div key={order.id} className="table-row-wrapper">
              <div className="table-row" onClick={() => toggleOrderDetails(order.id)}>
                <span>{order.id}</span>
                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                <span>${order.totalAmount.toFixed(2)}</span>
                <span>{order.status || 'Unknown'}</span>
                <span>{order.shippingAddress || 'N/A'}</span>
                <span>
                  <FontAwesomeIcon
                    icon={expandedOrder === order.id ? faChevronUp : faChevronDown}
                    className="toggle-icon"
                  />
                </span>
              </div>
              {expandedOrder === order.id && (
                <div className="order-details">
                  {order.items && order.items.length > 0 && (
                    <div className="order-items">
                      <div className="items-header">
                        <span>Product</span>
                        <span>Quantity</span>
                        <span>Price</span>
                      </div>
                      {order.items.map((item) => (
                        <div key={item.productId} className="items-row">
                          <span>{item.productName}</span>
                          <span>{item.quantity}</span>
                          <span>${item.price != null ? item.price.toFixed(2) : '0.00'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {order.trackingHistory && order.trackingHistory.length > 0 && (
                    <div className="tracking-history">
                      <h3>Tracking History</h3>
                      <div className="timeline">
                        {order.trackingHistory.map((tracking, index) => (
                          <div key={tracking.id || index} className="timeline-item">
                            <div className="timeline-icon">
                              <FontAwesomeIcon icon={faCircle} />
                            </div>
                            <div className="timeline-content">
                              <p className="tracking-status">{tracking.status}</p>
                              <p className="tracking-date">
                                {new Date(tracking.updatedAt).toLocaleString()}
                              </p>
                              {tracking.description && (
                                <p className="tracking-description">{tracking.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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