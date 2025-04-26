import axios from "axios";
import { useState, useEffect } from "react";
import "../../../styles/staff/Wallpapers.css";
import { useSelector } from "react-redux";

export default function Wallpapers() {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wallpapers, setWallpapers] = useState([]);
  const {token} = useSelector((state) => state.auth);

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
      await axios.delete(`http://localhost:8082/wallpaper/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setWallpapers(wallpapers.filter((wallpaper) => wallpaper.id !== id));
      console.log("Deleted wallpaper:", id);
    } catch (err) {
      setError("Failed to delete wallpaper: " + err.message);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = [...images, ...files];
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImages(newImages);
    setPreviews([...previews, ...newPreviews]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images.length) {
      setError("Please select at least one image.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();

    images.forEach((image) => {
      formData.append("images", image);
    });
    
    try {
      const response = await axios.post("http://localhost:8082/wallpaper/addWallpaper", formData, {
        headers: { "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Saved wallpapers:", response.data);
      // Reset form
      setImages([]);
      setPreviews([]);
      e.target.reset();
      // Refresh wallpapers list
      fetchWallpapers();
    } catch (err) {
      setError("Failed to save wallpapers: " + err.message);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup previews
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  return (
    <div className="form-container">
      <h2>SlideShow Wallpapers</h2>
      <form onSubmit={handleSubmit}>
        <div className="image-input-group">
          <label>Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={loading}
          />
          <div className="previews-container">
            {previews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index + 1}`}
                className="image-preview"
              />
            ))}
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Uploading..." : "Save Wallpapers"}
        </button>
      </form>

      <div className="wallpapers-list-container">
        <h2>Existing Wallpapers</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {wallpapers.length === 0 && !loading && !error && <p>No wallpapers found.</p>}
        <div className="wallpapers-grid">
          {wallpapers.map((wallpaper) => (
            <div key={wallpaper.id} className="wallpaper-item">
              <img
                src={`http://localhost:8082/wallpaper/${wallpaper.id}/image`}
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
    </div>
  );
}