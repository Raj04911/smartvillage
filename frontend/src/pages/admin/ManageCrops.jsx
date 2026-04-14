import React, { useState } from "react";
import "./ManageCrops.css";

const ManageCrops = () => {
  const [crops, setCrops] = useState([
    { id: 1, name: "Wheat", price: 25, quantity: 100 },
    { id: 2, name: "Rice", price: 30, quantity: 80 }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddCrop = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.quantity) {
      alert("Please fill all fields");
      return;
    }

    const newCrop = {
      id: crops.length + 1,
      name: formData.name,
      price: Number(formData.price),
      quantity: Number(formData.quantity)
    };

    setCrops([...crops, newCrop]);

    setFormData({
      name: "",
      price: "",
      quantity: ""
    });
  };

  const handleDelete = (id) => {
    const filtered = crops.filter((crop) => crop.id !== id);
    setCrops(filtered);
  };

  return (
    <div className="manage-crops">
      <div className="page-header">
        <h2>Manage Crops</h2>
        <p>Add, update and remove crops</p>
      </div>

      <div className="form-section">
        <form onSubmit={handleAddCrop}>
          <div className="form-group">
            <label>Crop Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Price per Kg</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Quantity Available</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="add-btn">
            Add Crop
          </button>
        </form>
      </div>

      <div className="table-section">
        <table className="crop-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Crop Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {crops.map((crop) => (
              <tr key={crop.id}>
                <td>{crop.id}</td>
                <td>{crop.name}</td>
                <td>₹ {crop.price}</td>
                <td>{crop.quantity} kg</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(crop.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCrops;