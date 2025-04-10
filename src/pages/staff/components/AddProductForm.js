import { useState } from "react";
import axios from "axios";
import "../../../styles/staff/AddProductForm.css";

const AddProductForm = () => {
  const categoryOptions = [
    { value: "", label: "Select Category" },
    { value: "Budget", label: "Budget" },
    { value: "Lower Midrange", label: "Lower Midrange" },
    { value: "High Midrange", label: "High Midrange" },
    { value: "Flagship", label: "Flagship" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    releaseDate: "",
    quantity: "",
    description: "", // New field
    img1: null,
    img2: null,
    img3: null,
    img4: null,
    price: "",
    isAvailable: false,
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle text, checkbox, and textarea inputs
  const handleInputChange = (e) => {
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
        [name]: files[0],
      }));
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();

      const productData = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        releaseDate: formData.releaseDate
          ? new Date(formData.releaseDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).split("/").join("-")
          : null,
        quantity: parseInt(formData.quantity) || 0,
        description: formData.description, // New field
        price: parseFloat(formData.price) || 0.0,
        isAvailable: formData.isAvailable,
        spec: formData.spec,
      };
      formDataToSend.append("product", JSON.stringify(productData));

      if (formData.img1) formDataToSend.append("img1", formData.img1);
      if (formData.img2) formDataToSend.append("img2", formData.img2);
      if (formData.img3) formDataToSend.append("img3", formData.img3);
      if (formData.img4) formDataToSend.append("img4", formData.img4);

      const response = await axios.post("http://localhost:8082/product/addProduct", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Product added successfully!");
      setFormData({
        name: "",
        brand: "",
        category: "",
        releaseDate: "",
        quantity: "",
        description: "", // Reset new field
        img1: null,
        img2: null,
        img3: null,
        img4: null,
        price: "",
        isAvailable: false,
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
    } catch (err) {
      setError(`Failed to add product: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div className="add-product-form">
      <h2>Add New Product</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Brand:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Release Date (YYYY-MM-DD):</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Enter product description here..."
          />
        </div>
        <div>
          <label>Image 1:</label>
          <input
            type="file"
            name="img1"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label>Image 2:</label>
          <input
            type="file"
            name="img2"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label>Image 3:</label>
          <input
            type="file"
            name="img3"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label>Image 4:</label>
          <input
            type="file"
            name="img4"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        <div>
          <label className="check-box">
            Available:
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <h3>Specifications</h3>
        <div>
          <label>Display:</label>
          <input
            type="text"
            name="spec.display"
            value={formData.spec.display}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Processor:</label>
          <input
            type="text"
            name="spec.processor"
            value={formData.spec.processor}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>RAM:</label>
          <input
            type="text"
            name="spec.ram"
            value={formData.spec.ram}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>OS:</label>
          <input
            type="text"
            name="spec.os"
            value={formData.spec.os}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Rear Camera:</label>
          <input
            type="text"
            name="spec.rearCamera"
            value={formData.spec.rearCamera}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Front Camera:</label>
          <input
            type="text"
            name="spec.frontCamera"
            value={formData.spec.frontCamera}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Security:</label>
          <input
            type="text"
            name="spec.security"
            value={formData.spec.security}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Battery:</label>
          <input
            type="text"
            name="spec.battery"
            value={formData.spec.battery}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;