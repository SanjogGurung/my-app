import axios from "axios";
import { useState, useEffect } from "react";
import "../../../styles/staff/WallpapersList.css";

export default function WallpapersList() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wallpapers on component mount
  useEffect(() => {
    fetchWallpapers();
  }, []);

  const fetchWallpapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8082/wallpaper/wallpapers");
      setWallpapers(response.data);
    } catch (err) {
      setError("Failed to fetch wallpapers: " + err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle wallpaper deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this wallpaper?")) return;

    setLoading(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:8082/wallpaper/${id}`);
      setWallpapers(wallpapers.filter((wallpaper) => wallpaper.id !== id));
      console.log("Deleted wallpaper:", id);
    } catch (err) {
      setError("Failed to delete wallpaper: " + err.message);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallpapers-list-container">
      <h2>Wallpapers List</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {wallpapers.length === 0 && !loading && !error && <p>No wallpapers found.</p>}
      <div className="wallpapers-grid">
        {wallpapers.map((wallpaper) => (
          <div key={wallpaper.id} className="wallpaper-item">
            <img
              src={`http://localhost:8082/wallpaper/${id}/image`}
              alt={`Wallpaper ${wallpaper.id}`}
              className="wallpaper-image"
            />
            <button
              onClick={() => handleDelete(wallpaper.id)}
              className="delete-btn"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}