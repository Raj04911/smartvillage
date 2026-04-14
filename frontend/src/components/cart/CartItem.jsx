import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import "./CartItem.css";

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="cart-item">
      <div className="cart-info">
        <h4>{item.name}</h4>
        <p>Quantity: {item.quantity} kg</p>
      </div>

      <div className="cart-price">
        <p>{formatCurrency(item.total)}</p>
        <button
          className="remove-btn"
          onClick={() => onRemove(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;