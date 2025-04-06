import "../../../styles/staff/Users.css"
import { useState, useEffect } from "react";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken"); // Adjust based on your auth
        const response = await axios.get("http://localhost:8082/user/users");
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch users: ${err.message}`);
        setLoading(false);
        console.error(err);
      }
    };
    fetchUsers();
  }, []); // Runs once on mount

  // Handle delete button click
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("authToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`http://localhost:8082/users/${userId}`, config);
      setUsers(users.filter((user) => user.id !== userId)); // Remove user from state
    } catch (err) {
      setError(`Failed to delete user: ${err.message}`);
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="users-content">
      <h2>Users</h2>
      {users && users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No Users</div>
      )}
    </div>
  );
};

export default UsersList;