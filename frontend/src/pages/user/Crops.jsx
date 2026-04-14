import React, { useEffect, useState } from "react";
import axios from "axios";
import CropCard from "../../components/crops/CropCard";
import { formatCurrency } from "../../utils/formatCurrency";
import "./Crops.css";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [quantities, setQuantities] = useState({});

  const fetchCrops = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/crops");
      setCrops(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCrops();

    const interval = setInterval(() => {
      fetchCrops();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities({
      ...quantities,
      [id]: value
    });
  };

  const handleAddToCart = (crop) => {
    const quantity = Number(quantities[crop._id] || 1);

    if (quantity <= 0) {
      alert("Invalid quantity");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(
      (item) => item._id === crop._id
    );

    if (existingItem) {
      cart = cart.map((item) =>
        item._id === crop._id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              total: (item.quantity + quantity) * item.price
            }
          : item
      );
    } else {
      cart.push({
        _id: crop._id,
        name: crop.name,
        price: crop.price,
        quantity: quantity,
        total: crop.price * quantity
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(
      `${crop.name} added to cart for ${formatCurrency(
        crop.price * quantity
      )}`
    );
  };

  return (
    <div className="crops-page">
      <div className="crops-header">
        <h2>Available Crops</h2>
        <p>Browse fresh produce directly from village farmers.</p>
      </div>

      <div className="crops-grid">
        {crops?.length > 0 ? (
          crops.map((crop) => (
            <CropCard
              key={crop._id}
              crop={crop}
              quantity={quantities[crop._id]}
              onQuantityChange={handleQuantityChange}
              onAdd={handleAddToCart}
            />
          ))
        ) : (
          <p>No crops available</p>
        )}
      </div>
    </div>
  );
};

export default Crops;