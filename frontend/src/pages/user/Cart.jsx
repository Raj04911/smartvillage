import React, { useState, useEffect } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatCurrency } from "../../utils/formatCurrency";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateQuantity = (id, value) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? {
          ...item,
          quantity: Number(value),
          total: Number(value) * item.price
        }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const filtered = cart.filter((item) => item._id !== id);
    setCart(filtered);
    localStorage.setItem("cart", JSON.stringify(filtered));
  };

  const getGrandTotal = () => {
    return cart.reduce((acc, item) => acc + item.total, 0);
  };

  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Login first");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/orders/create", {
        userId: user.email,
        userName: user.name,
        userEmail: user.email,
        items: cart.map((item) => ({
          cropId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total
        })),
        totalAmount: getGrandTotal()
      });

      alert("Order placed");

      localStorage.removeItem("cart");
      setCart([]);

      navigate("/dashboard/orders");

    } catch (error) {
      console.log(error);
      alert("Error placing order");
    }
  };

  return (
    <div className="cart-page">
      <div className="page-header">
        <h2>Your Cart</h2>
        <p>Review your selected crops</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">Cart is empty</div>
      ) : (
        <>
          <div className="cart-table-section">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {cart.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item._id, e.target.value)
                        }
                      />
                    </td>
                    <td>{formatCurrency(item.total)}</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <div className="total-amount">
              Grand Total: {formatCurrency(getGrandTotal())}
            </div>

            <button
              className="order-btn"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;