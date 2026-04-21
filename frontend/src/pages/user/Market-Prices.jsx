import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import "./MarketPrices.css";

const MarketPrices = () => {
  const [prices, setPrices] = useState([]);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const [insightsResponse, overviewResponse] = await Promise.all([
          api.get("/crops/price-insights"),
          api.get("/crops/market-overview")
        ]);
        setPrices(insightsResponse.data.insights);
        setOverview(overviewResponse.data.overview);
      } catch (error) {
        console.error(error);
      }
    };

    loadInsights();
  }, []);

  return (
    <div className="market-page">
      <div className="market-header">
        <h2>Price Analysis Prediction</h2>
        <p>Current market rates with short-term forecast trends</p>
      </div>

      {overview ? (
        <div className="overview-grid">
          <div className="overview-card">
            <h3>Best Opportunity</h3>
            <p>
              {overview.bestOpportunity?.crop} in {overview.bestOpportunity?.district},{" "}
              {overview.bestOpportunity?.state}
            </p>
          </div>
          <div className="overview-card">
            <h3>Highest Risk</h3>
            <p>
              {overview.highestRisk?.crop} in {overview.highestRisk?.district},{" "}
              {overview.highestRisk?.state}
            </p>
          </div>
          <div className="overview-card">
            <h3>Demand Hotspots</h3>
            <p>{overview.demandHotspots?.map((item) => item.label).join(" • ")}</p>
          </div>
        </div>
      ) : null}

      <div className="market-card">
        <table className="market-table">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Location</th>
              <th>Current</th>
              <th>Predicted</th>
              <th>Change</th>
              <th>Demand</th>
              <th>Outlook</th>
              <th>Opportunity</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((item) => (
              <tr key={item._id}>
                <td>{item.crop}</td>
                <td>{item.district}, {item.state}</td>
                <td>₹ {item.currentPrice}</td>
                <td>₹ {item.predictedPrice}</td>
                <td className={item.change >= 0 ? "up" : "down"}>
                  {item.change >= 0 ? "+" : ""}
                  {item.change}
                </td>
                <td>{item.demandLevel}</td>
                <td>{item.outlook}</td>
                <td>{item.opportunityScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketPrices;
