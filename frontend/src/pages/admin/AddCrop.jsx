import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { fallbackLocationFilters } from "../../utils/locationOptions";
import "./AddCrop.css";

const AddCrop = () => {
  const [filters, setFilters] = useState({ states: [], districts: [], stateDistrictMap: {} });
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: "",
    state: "",
    district: "",
    season: "",
    demandLevel: "Moderate",
    aiScore: ""
  });

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const response = await api.get("/crops/filters");
        const apiFilters = response.data.filters;
        setFilters({
          ...fallbackLocationFilters,
          ...apiFilters,
          states: apiFilters?.states?.length ? apiFilters.states : fallbackLocationFilters.states,
          districts: apiFilters?.districts?.length ? apiFilters.districts : fallbackLocationFilters.districts,
          stateDistrictMap: Object.keys(apiFilters?.stateDistrictMap || {}).length
            ? apiFilters.stateDistrictMap
            : fallbackLocationFilters.stateDistrictMap
        });
      } catch (error) {
        console.error(error);
        setFilters(fallbackLocationFilters);
      }
    };

    loadFilters();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { district: "" } : {})
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await api.post("/crops/create", {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        aiScore: Number(formData.aiScore || 0),
        priceHistory: [Number(formData.price || 0)],
        demandHistory: [Number(formData.aiScore || 0)]
      });

      alert("Crop Added Successfully");
      setFormData({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        image: "",
        state: "",
        district: "",
        season: "",
        demandLevel: "Moderate",
        aiScore: ""
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
        <p>Enter crop details to list it in the marketplace</p>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Crop Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Stock (kg)</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} />
            </div>

          <div className="form-group">
            <label>Season</label>
            <input type="text" name="season" value={formData.season} onChange={handleChange} />
          </div>
          </div>

          <div className="form-group">
            <label>Crop Image Link</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/crop-image.jpg"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>State</label>
              <select name="state" value={formData.state} onChange={handleChange} required>
                <option value="">Select state</option>
                {filters.states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>District</label>
              <select name="district" value={formData.district} onChange={handleChange} required>
                <option value="">Select district</option>
                {(formData.state
                  ? filters.stateDistrictMap[formData.state] || []
                  : filters.districts
                ).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Demand Level</label>
              <select name="demandLevel" value={formData.demandLevel} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>AI Score</label>
              <input type="number" name="aiScore" value={formData.aiScore} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
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
