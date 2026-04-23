import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import api from "../../utils/api";
import { fallbackLocationFilters } from "../../utils/locationOptions";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [delivery, setDelivery] = useState({
    addressLine: "",
    state: "",
    district: "",
    pincode: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setCart(storedCart);
    setDelivery({
      addressLine: storedUser.addressLine || "",
      state: storedUser.state || "",
      district: storedUser.district || "",
      pincode: storedUser.pincode || ""
    });
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

  const getGrandTotal = () => cart.reduce((acc, item) => acc + item.total, 0);

  const handleDeliveryChange = (event) => {
    const { name, value } = event.target;

    setDelivery((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { district: "" } : {})
    }));
  };

  const saveDeliveryProfile = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?._id) {
      return;
    }

    const response = await api.put(`/auth/users/${user._id}`, {
      addressLine: delivery.addressLine,
      state: delivery.state,
      district: delivery.district,
      pincode: delivery.pincode
    });

    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data.user;
  };

  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Login first");
      return;
    }

    if (
      !delivery.addressLine ||
      !delivery.state ||
      !delivery.district ||
      !delivery.pincode
    ) {
      alert("Please complete delivery address, pincode, district, and state.");
      return;
    }

    try {
      const savedUser = (await saveDeliveryProfile()) || user;

      await api.post("/orders/create", {
        userId: savedUser._id || savedUser.email,
        userName: savedUser.name,
        userEmail: savedUser.email,
        state: delivery.state,
        district: delivery.district,
        items: cart.map((item) => ({
          cropId: item.cropId || item._id || item.id,
          name: item.name,
          state: item.state,
          district: item.district,
          price: item.price,
          quantity: item.quantity,
          total: item.total
        })),
        totalAmount: getGrandTotal(),
        deliveryAddress: {
          addressLine: delivery.addressLine,
          district: delivery.district,
          state: delivery.state,
          pincode: delivery.pincode
        }
      });

      alert("Order placed");
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/orders");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error placing order");
    }
  };

  const availableDistricts = delivery.state
    ? fallbackLocationFilters.stateDistrictMap[delivery.state] || []
    : fallbackLocationFilters.districts;

  return (
    <div className="cart-page">
      <div className="page-header">
        <h2>Your Cart</h2>
        <p>Review your selected crops and confirm your delivery details.</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">Cart is empty</div>
      ) : (
        <>
          <div className="delivery-card">
            <div className="delivery-header">
              <div>
                <h3>Delivery Details</h3>
                <p>Edit address, select your location, and confirm pincode before checkout.</p>
              </div>
            </div>

            <div className="delivery-grid">
              <textarea
                name="addressLine"
                value={delivery.addressLine}
                onChange={handleDeliveryChange}
                placeholder="Full delivery address"
              />
              <select name="state" value={delivery.state} onChange={handleDeliveryChange}>
                <option value="">Select state</option>
                {fallbackLocationFilters.states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <select name="district" value={delivery.district} onChange={handleDeliveryChange}>
                <option value="">Select district</option>
                {availableDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="pincode"
                value={delivery.pincode}
                onChange={handleDeliveryChange}
                placeholder="Pincode"
              />
            </div>

            <div className="delivery-status">
              Tracking will use your selected district location on the map.
            </div>
          </div>

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
                        onChange={(event) => updateQuantity(item._id, event.target.value)}
                      />
                    </td>
                    <td>{formatCurrency(item.total)}</td>
                    <td>
                      <button className="remove-btn" onClick={() => removeItem(item._id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <div className="total-amount">Grand Total: {formatCurrency(getGrandTotal())}</div>

            <button className="order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
