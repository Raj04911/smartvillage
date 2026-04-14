import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import "./CropCard.css";

const CropCard = ({ crop, quantity, onQuantityChange, onAdd }) => {
  return (
    <div className="crop-card">
      <div className="crop-card-header">
        <h3>{crop.name}</h3>
        <span className="crop-stock">
          Stock: {crop.stock} kg
        </span>
      </div>

      <div className="crop-card-body">
        <div className="crop-price">
          {formatCurrency(crop.price)} / kg
        </div>

        <div className="crop-controls">
          <input
            type="number"
            min="1"
            value={quantity || ""}
            onChange={(e) =>
              onQuantityChange(crop.id, e.target.value)
            }
            placeholder="Qty"
          />

          <button
            className="add-cart-btn"
            onClick={() => onAdd(crop)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropCard;