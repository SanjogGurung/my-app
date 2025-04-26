// src/pages/staff/EditProductFormPage.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/ProductCard.css";
import { Link } from "react-router-dom"; // Add this for routing
import '../../styles/staff/EditProductForm.css'


const EditProductFormPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const productFromState = location.state?.product;

  const imagePreview1 = `http://localhost:8082/product/${id}/image/1`;
  const imagePreview2 = `http://localhost:8082/product/${id}/image/2`;
  const imagePreview3 = `http://localhost:8082/product/${id}/image/3`;
  const imagePreview4 = `http://localhost:8082/product/${id}/image/4`;

  const categoryOptions = [
    { value: "", label: "Select Category" },
    { value: "Budget", label: "Budget" },
    { value: "Lower Midrange", label: "Lower Midrange" },
    { value: "High Midrange", label: "High Midrange" },
    { value: "Flagship", label: "Flagship" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    isOnSale: false,
    discountPercentage: 0,
    quantity: 0,
    releaseDate : "",
    brand: "", 
    category: "",
    imageName1: null, 
    imageName2: null,
    imageName3: null,
    imageName4: null,
    img1: null,
    img2: null,
    img3: null,
    img4: null,
    spec: {
      display: "",
      processor: "",
      ram: "",
      os: "",
      rearCamera: "",
      frontCamera: "",
      security: "",
      battery: "",
    },
  });
  const [loading, setLoading] = useState(!productFromState); // Load if no state
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productFromState) {
      // Use product from state if available
      setFormData({
        name: productFromState.name || "",
        price: productFromState.price || "",
        description: productFromState.description || "",
        isOnSale: productFromState.isOnSale || false,
        isAvailable: productFromState.isAvailable || false,
        brand: productFromState.brand || "",
        category: productFromState.category || "",
        releaseDate: productFromState.releaseDate || "",
        quantity: productFromState.quantity || 0,
        discountPercentage: productFromState.discountPercentage || 0,
        imageName1: productFromState.imageName1,
        imageName2: productFromState.imageName2,
        imageName3: productFromState.imageName3,
        imageName4: productFromState.imageName4,
        spec: {
          display: productFromState.spec?.display || "",
          processor: productFromState.spec?.processor || "",
          ram: productFromState.spec?.ram || "",
          os: productFromState.spec?.os || "",
          rearCamera: productFromState.spec?.rearCamera || "",
          frontCamera: productFromState.spec?.frontCamera || "",
          security: productFromState.spec?.security || "",
          battery: productFromState.spec?.battery || "",
        },
      });
      console.log(formData);
    } else {
      // Fetch product if no state
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:8082/product/${id}`);
          setFormData({
            name: response.data.name || "",
            price: response.data.price || "",
            description: response.data.description || "",
            isOnSale: response.data.isOnSale || false,
            isAvailable: response.data.isAvailable || false,
            brand: response.data.brand || "",
            category: response.data.category || "",
            releaseDate: response.data.releaseDate || "",
            discountPercentage: response.data.discountPercentage || 0,
            imageName1: response.data.imageName1, // Reset file inputs
            imageName2: response.data.imageName2,
            imageName3: response.data.imageName3,
            imageName4: response.data.imageName4,
            spec: {
              display: productFromState.spec?.display || "",
              processor: productFromState.spec?.processor || "",
              ram: productFromState.spec?.ram || "",
              os: productFromState.spec?.os || "",
              rearCamera: productFromState.spec?.rearCamera || "",
              frontCamera: productFromState.spec?.frontCamera || "",
              security: productFromState.spec?.security || "",
              battery: productFromState.spec?.battery || "",            
          },
        });
          setLoading(false);
        } catch (err) {
          console.error("Fetch Error:", err);
          setError("Failed to load product.");
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, productFromState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("spec.")) {
      const specField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        spec: {
          ...prev.spec,
          [specField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle file inputs
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0], // Store the File object
      }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      const updatedProduct = {
        name: formData.name,
        price: parseFloat(formData.price) || 0.0,
        discountedPrice : formData.isOnSale && formData.discountPercentage > 0 ? parseFloat((parseFloat(formData.price) || 0.0) * (1 - (parseInt(formData.discountPercentage, 10) || 0) / 100)).toFixed(2) : null,
        description: formData.description,
        isOnSale: formData.isOnSale,
        isAvailable: formData.isAvailable, // New field 
        quantity: parseInt(formData.quantity) || 0,
        imageName1: formData.imageName1,
        imageName2: formData.imageName2,
        imageName3: formData.imageName3,
        imageName4: formData.imageName4,
        releaseDate: formData.releaseDate
          ? new Date(formData.releaseDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).split("/").join("-")
          : null,
        brand: formData.brand,
        category: formData.category,
        discountPercentage: parseInt(formData.discountPercentage, 10) || 0,
        spec: formData.spec,
      };

      formDataToSend.append("updatedProduct", JSON.stringify(updatedProduct));

      if (formData.img1) formDataToSend.append("img1", formData.img1);
      if (formData.img2) formDataToSend.append("img2", formData.img2);
      if (formData.img3) formDataToSend.append("img3", formData.img3);
      if (formData.img4) formDataToSend.append("img4", formData.img4);


      const response = await axios.put(
        `http://localhost:8082/product/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      console.log("Edit response:", response.data);
      alert("Product updated successfully!");
      navigate("/staff/products");
    } catch (err) {
      console.error("Edit Error:", err);
      alert("Failed to update product.");
    }
  };

  const handleCancel = () => {
    navigate("/staff/products");
  };

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>{error} <Link to="/staff/products">Go back</Link></div>;

  return (
    <div className="edit-product-page">
      <h2>Edit {formData.name}</h2>
      <form className="edit-product-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="basic-fields">
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </label>
          <label>
            On Sale:
            <input
              type="checkbox"
              name="isOnSale"
              checked={formData.isOnSale}
              onChange={handleChange}
            />
          </label>
          <label>
            Discount (%):
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              min="0"
              max="100"
              disabled={!formData.isOnSale}
            />
          </label>
          <label>
            Available:
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </label>
          <label>
            Release Date:
            <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} />
          </label>
          <label>
            Brand:
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
          </label>
          <label>
            Category:
            <select name="category" value={formData.category} onChange={handleChange} required>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter product description here..."
            />
          </label>
        </div>

        <h4>Images</h4>
        <div className="images-section">
          <div className="image-field">
            <label>
              Image 1:
              <input type="file" name="img1" accept="image/*" onChange={handleFileChange} />
            </label>
            {imagePreview1 && (
              <img src={imagePreview1} alt="Image 1 Preview" className="image-preview" />
            )}
          </div>
          <div className="image-field">
            <label>
              Image 2:
              <input type="file" name="img2" accept="image/*" onChange={handleFileChange} />
            </label>
            {imagePreview2 && (
              <img src={imagePreview2} alt="Image 2 Preview" className="image-preview" />
            )}
          </div>
          <div className="image-field">
            <label>
              Image 3:
              <input type="file" name="img3" accept="image/*" onChange={handleFileChange} />
            </label>
            {imagePreview3 && (
              <img src={imagePreview3} alt="Image 3 Preview" className="image-preview" />
            )}
          </div>
          <div className="image-field">
            <label>
              Image 4:
              <input type="file" name="img4" accept="image/*" onChange={handleFileChange} />
            </label>
            {imagePreview4 && (
              <img src={imagePreview4} alt="Image 4 Preview" className="image-preview" />
            )}
          </div>
        </div>

        <h4>Specifications</h4>
        <div className="specifications-section">
          <label>
            Display:
            <input type="text" name="spec.display" value={formData.spec.display} onChange={handleChange} />
          </label>
          <label>
            Processor:
            <input
              type="text"
              name="spec.processor"
              value={formData.spec.processor}
              onChange={handleChange}
            />
          </label>
          <label>
            RAM:
            <input type="text" name="spec.ram" value={formData.spec.ram} onChange={handleChange} />
          </label>
          <label>
            OS:
            <input type="text" name="spec.os" value={formData.spec.os} onChange={handleChange} />
          </label>
          <label>
            Rear Camera:
            <input
              type="text"
              name="spec.rearCamera"
              value={formData.spec.rearCamera}
              onChange={handleChange}
            />
          </label>
          <label>
            Front Camera:
            <input
              type="text"
              name="spec.frontCamera"
              value={formData.spec.frontCamera}
              onChange={handleChange}
            />
          </label>
          <label>
            Security:
            <input
              type="text"
              name="spec.security"
              value={formData.spec.security}
              onChange={handleChange}
            />
          </label>
          <label>
            Battery:
            <input
              type="text"
              name="spec.battery"
              value={formData.spec.battery}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductFormPage;