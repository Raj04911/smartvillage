import React, { useState } from "react";
import "./MarketPrices.css";

const MarketPrices = () => {
  const [prices] = useState([
    { crop: "Wheat", price: 25, change: "+2", location: "Mangalore" },
    { crop: "Rice", price: 30, change: "-1", location: "Udupi" },
    { crop: "Tomato", price: 20, change: "+3", location: "Bangalore" },
    { crop: "Onion", price: 18, change: "-2", location: "Mysore" },
    { crop: "Potato", price: 22, change: "+1", location: "Hubli" }
  ]);

  return (
    <div className="market-page">
      <div className="market-header">
        <h2>Today's Market Prices</h2>
        <p>Live mandi price updates across regions</p>
      </div>

      <div className="market-card">
        <table className="market-table">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Location</th>
              <th>Price (₹/kg)</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((item, index) => (
              <tr key={index}>
                <td>{item.crop}</td>
                <td>{item.location}</td>
                <td>₹ {item.price}</td>
                <td className={item.change.includes("+") ? "up" : "down"}>
                  {item.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketPrices;