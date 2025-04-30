import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../../styles/staff/Brands.css";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8082/brand/brands");
      setBrands(response.data);
    } catch (err) {
      setError("Failed to fetch brands: " + err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle brand deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    setLoading(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:8082/brand/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBrands(brands.filter((brand) => brand.id !== id));
      console.log("Deleted brand:", id);
    } catch (err) {
      setError("Failed to delete brand: " + err.message);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandName) {
      setError("Please enter a brand name.");
      return;
    }
    if (!image) {
      setError("Please select a brand photo.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", brandName);
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:8082/brand/addBrand", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Saved brand:", response.data);
      // Reset form
      setBrandName("");
      setImage(null);
      setPreview(null);
      e.target.reset();
      // Refresh brands list
      fetchBrands();
    } catch (err) {
      setError("Failed to save brand: " + err.message);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="form-container">
      <h2>Manage Brands</h2>
      <form onSubmit={handleSubmit} className="form-brands">
        <div className="input-group">
          <label>Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Enter brand name"
            disabled={loading}
          />
        </div>
        <div className="image-input-group">
          <label>Upload Brand Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
          {preview && (
            <div className="previews-container">
              <img src={preview} alt="Brand Preview" className="image-preview" />
            </div>
          )}
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Brand"}
        </button>
      </form>

      <div className="brands-list-container">
        <h2>Existing Brands</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {brands.length === 0 && !loading && !error && <p>No brands found.</p>}
        <div className="brands-grid">
          {brands.map((brand) => (
            <div key={brand.id} className="brand-item">
              <img
                src={`http://localhost:8082/brand/${brand.id}/imageGet`}
                alt={`Brand ${brand.name}`}
                className="brand-image"
              />
              <p>{brand.name}</p>
              <button
                onClick={() => handleDelete(brand.id)}
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