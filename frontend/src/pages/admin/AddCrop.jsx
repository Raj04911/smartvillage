import React, { useState } from "react";
import axios from "axios";
import "./AddCrop.css";

const AddCrop = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/crops/create", {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        description: formData.description
      });

      alert("Crop Added Successfully");

      setFormData({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: ""
      });

    } catch (error) {
      console.error(error);
      alert("Error adding crop");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Add New Crop</h2>
        <p>Enter crop details to list it in marketplace</p>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Crop Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock (kg)</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="primary-btn">
            Add Crop
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddCrop;