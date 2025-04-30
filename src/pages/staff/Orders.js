import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateTrackingStatus, clearOrderError } from "../../redux/slices/orderSlice";
import '../../styles/staff/Orders.css'

export default function Orders() {
  const dispatch = useDispatch();
  const { allOrders: orders, status, error } = useSelector((state) => state.order);

  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [description, setDescription] = useState("");

  // Possible tracking statuses
  const trackingStatuses = [
    "Order Placed",
    "Payment Confirmed",
    "Shipped",
    "Delivered",
  ];

  // Fetch all orders on component mount
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch]);

  // Handle tracking status update
  const handleUpdateTracking = (orderId) => {
    let finalDescription = description;
    if (newStatus === "Shipped" && trackingNumber) {
      finalDescription = `Order has been shipped. Tracking number: ${trackingNumber}`;
    } else if (newStatus === "Delivered") {
      finalDescription = "Order has been delivered to the customer";
    } else if (!finalDescription) {
      finalDescription = `${newStatus} status updated`;
    }

    dispatch(updateTrackingStatus({ orderId, status: newStatus, description: finalDescription }));

    // Reset form fields
    setUpdatingOrderId(null);
    setNewStatus("");
    setTrackingNumber("");
    setDescription("");
  };

  if (status === "loading") return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="orders-content">
      <h2>Orders</h2>
      {orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Current Status</th>
              <th>Tracking History</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.email}</td> {/* Replace with customer name if available */}
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>
                  <ul>
                    {order.trackingHistory.map((track, index) => (
                      <li key={index}>
                        {track.status} - {track.description} (Updated: {new Date(track.updatedAt).toLocaleString()})
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  {updatingOrderId === order.id ? (
                    <div>
                      <select
                         value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        {trackingStatuses
                          .filter((status) => status !== order.status)
                          .map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                      </select>
                      {newStatus === "Shipped" && (
                        <input
                          type="text"
                          placeholder="Tracking Number"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                      )}
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <button onClick={() => handleUpdateTracking(order.id)}>
                        Update
                      </button>
                      <button onClick={() => setUpdatingOrderId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setUpdatingOrderId(order.id)}>
                      Update Tracking
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}