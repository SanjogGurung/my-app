import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faCircle } from '@fortawesome/free-solid-svg-icons';
import '../../styles/staff/Overview.css';

const Overview = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const isStaff = user?.role && (user.role.toLowerCase() === 'staff' || user.role.toLowerCase() === 'admin');

  useEffect(() => {
    const fetchData = async () => {
      if (!isStaff) {
        setError('Unauthorized: Only staff or admin can access this page');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const usersResponse = await axios.get('http://localhost:8082/user/all', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setUsers(usersResponse.data);

        const productsResponse = await axios.get('http://localhost:8082/product/products', {
          headers: { 'Content-Type': 'application/json' },
        });
        setProducts(productsResponse.data);

        const ordersResponse = await axios.get('http://localhost:8082/staff/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setAllOrders(ordersResponse.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isStaff]);

  const handleOrderClick = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalOrders = allOrders.length;

  if (isLoading) return <div className="overview-content"><p>Loading...</p></div>;
  if (error) return <div className="overview-content"><p>Error: {error}</p></div>;

  return (
    <div className="overview-content">
      <h2>Overview</h2>
      <div className="metrics-boxes">
        <div className="metric-box">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="metric-box">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>
        <div className="metric-box">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
      </div>
      <div className="orders-section">
        <h3>All Orders</h3>
        {allOrders.length > 0 ? (
          <div className="orders-table">
            <div className="table-header">
              <span>Order ID</span>
              <span>Date</span>
              <span>Total</span>
              <span>Status</span>
              <span>Shipping Address</span>
              <span></span>
            </div>
            {allOrders.map((order) => (
              <div key={order.id} className="table-row-wrapper">
                <div className="table-row" onClick={() => handleOrderClick(order.id)}>
                  <span>{order.id}</span>
                  <span>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</span>
                  <span>NPR {(order.totalAmount || 0).toFixed(2)}</span>
                  <span>{order.status || 'N/A'}</span>
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
                    <div className="order-info">
                      <h4>Order Information</h4>
                      <p><strong>Customer Email:</strong> {order.email || 'N/A'}</p>
                      <p><strong>Shipping Address:</strong> {order.shippingAddress || 'N/A'}</p>
                      <p><strong>Phone Number:</strong> {order.phoneNumber || 'N/A'}</p>
                      <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="order-items">
                        <div className="items-header">
                          <span>Product</span>
                          <span>Quantity</span>
                          <span>Price</span>
                        </div>
                        {order.items.map((item) => (
                          <div key={item.id} className="items-row">
                            <span>{item.productName || 'N/A'}</span>
                            <span>{item.quantity || 'N/A'}</span>
                            <span>NPR {(item.price || 0).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {order.trackingHistory && order.trackingHistory.length > 0 ? (
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
                    ) : (
                      <div className="tracking-history">
                        <h3>Tracking History</h3>
                        <p>No tracking history available.</p>
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
      </div>
    </div>
  );
};

export default Overview;