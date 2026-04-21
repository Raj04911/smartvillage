import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import "./ManageCrops.css";

const ManageCrops = () => {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const loadCrops = async () => {
      try {
        const response = await api.get("/crops");
        setCrops(response.data.crops);
      } catch (error) {
        console.error(error);
      }
    };

    loadCrops();
  }, []);

  return (
    <div className="manage-crops">
      <div className="page-header">
        <h2>Manage Crops</h2>
        <p>Live crop inventory coming directly from your online database</p>
      </div>

      <div className="table-section">
        <table className="crop-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Crop Name</th>
              <th>Location</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Demand</th>
            </tr>
          </thead>

          <tbody>
            {crops.map((crop) => (
              <tr key={crop._id}>
                <td>{crop._id.slice(-5)}</td>
                <td>{crop.name}</td>
                <td>{crop.district}, {crop.state}</td>
                <td>₹ {crop.price}</td>
                <td>{crop.stock} kg</td>
                <td>{crop.demandLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCrops;
