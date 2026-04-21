import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import "./CropCard.css";

const CropCard = ({
  crop,
  quantity,
  prediction,
  onQuantityChange,
  onAdd,
  onPredict,
  canOrder
}) => {
  return (
    <div className="crop-card">
      {crop.image ? <img src={crop.image} alt={crop.name} className="crop-image" /> : null}
      <div className="crop-card-header">
        <h3>{crop.name}</h3>
        <span className="crop-stock">
          Stock: {crop.stock} kg
        </span>
      </div>

      <div className="crop-card-body">
        <div className="crop-meta">
          <span>{crop.category}</span>
          <span>
            {crop.district}, {crop.state}
          </span>
        </div>

        <div className="crop-price">
          {formatCurrency(crop.price)} / kg
        </div>

        <p className="crop-description">{crop.description}</p>

        <div className="crop-tags">
          <span>Demand: {crop.demandLevel}</span>
          <span>Season: {crop.season}</span>
          <span>AI Score: {crop.aiScore}</span>
        </div>

        <div className="crop-controls">
          <input
            type="number"
            min="1"
            value={quantity || ""}
            onChange={(e) =>
              onQuantityChange(crop._id, e.target.value)
            }
            placeholder="Qty"
          />

          <button className="predict-btn" onClick={() => onPredict(crop._id)}>
            AI Predict
          </button>
          <button className="add-cart-btn" onClick={() => onAdd(crop)}>
            {canOrder ? "Add to Cart" : "Login to Order"}
          </button>
        </div>

        {prediction ? (
          <div className="prediction-box">
            <strong>
              {prediction.source === "openrouter" ? "OpenRouter AI" : "Smart Heuristic"} Prediction
            </strong>
            <p>{prediction.summary}</p>
            <span>Predicted price: {formatCurrency(prediction.predictedPrice)}</span>
            <span>Confidence: {prediction.confidence}%</span>
            <span>Outlook: {prediction.outlook}</span>
            <span>Risk: {prediction.riskLevel}</span>
            <span>Best window: {prediction.bestWindow}</span>
            <span>District benchmark: {formatCurrency(prediction.benchmarkPrice || crop.price)}</span>
            <span>{prediction.recommendedAction}</span>
            {prediction.marketNarrative ? (
              <pre className="prediction-narrative">{prediction.marketNarrative}</pre>
            ) : null}
            {prediction.actionSteps?.length ? (
              <div className="prediction-steps">
                {prediction.actionSteps.map((step) => (
                  <span key={step}>{step}</span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CropCard;
