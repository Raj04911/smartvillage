import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CropCard from "../../components/crops/CropCard";
import api from "../../utils/api";
import { fallbackLocationFilters } from "../../utils/locationOptions";
import "./Crops.css";

const Crops = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [crops, setCrops] = useState([]);
  const [filters, setFilters] = useState({
    states: [],
    districts: [],
    categories: [],
    seasons: [],
    stateDistrictMap: {}
  });
  const [selected, setSelected] = useState({
    state: user?.state || "",
    district: user?.district || "",
    category: "",
    season: "",
    search: ""
  });
  const [recommendations, setRecommendations] = useState([]);
  const [predictionMap, setPredictionMap] = useState({});
  const [predictionLoadingMap, setPredictionLoadingMap] = useState({});
  const [quantities, setQuantities] = useState({});

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
          categories: apiFilters?.categories?.length ? apiFilters.categories : fallbackLocationFilters.categories,
          seasons: apiFilters?.seasons?.length ? apiFilters.seasons : fallbackLocationFilters.seasons,
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

  useEffect(() => {
    const loadCrops = async () => {
      try {
        const response = await api.get("/crops", { params: selected });
        setCrops(response.data.crops);
      } catch (error) {
        console.error(error);
      }
    };

    loadCrops();
  }, [selected]);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await api.get("/crops/recommendations", {
          params: {
            state: selected.state,
            district: selected.district
          }
        });
        setRecommendations(response.data.recommendations);
      } catch (error) {
        console.error(error);
      }
    };

    loadRecommendations();
  }, [selected.state, selected.district]);

  const handlePrediction = async (cropId) => {
    setPredictionLoadingMap((prev) => ({
      ...prev,
      [cropId]: true
    }));

    try {
      const response = await api.get(`/crops/${cropId}/predict`);
      setPredictionMap((prev) => ({
        ...prev,
        [cropId]: response.data.prediction
      }));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "AI not connected.");
    } finally {
      setPredictionLoadingMap((prev) => ({
        ...prev,
        [cropId]: false
      }));
    }
  };

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAddToCart = (crop) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const quantity = Number(quantities[crop._id] || 1);

    if (quantity <= 0) {
      alert("Invalid quantity");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item._id === crop._id);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      cart.push({
        _id: crop._id,
        cropId: crop._id,
        name: crop.name,
        state: crop.state,
        district: crop.district,
        price: crop.price,
        quantity,
        total: crop.price * quantity
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${crop.name} added to cart.`);
  };

  return (
    <div className="market-explorer">
      <div className="market-hero">
        <div>
          <span className="section-tag">Public Crop Access</span>
          <h2>Explore crops by state and district without logging in.</h2>
          <p>
            Filter live inventory, inspect demand signals, and open AI prediction cards
            before deciding to signup or buy.
          </p>
        </div>
        {!user ? (
          <button className="market-cta" onClick={() => navigate("/signup")}>
            Signup to Order
          </button>
        ) : null}
      </div>

      <div className="market-filters">
        <input
          placeholder="Search crop, district, state"
          value={selected.search}
          onChange={(event) => setSelected((prev) => ({ ...prev, search: event.target.value }))}
        />
        <select
          value={selected.state}
          onChange={(event) =>
            setSelected((prev) => ({
              ...prev,
              state: event.target.value,
              district: ""
            }))
          }
        >
          <option value="">All states</option>
          {filters.states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={selected.district}
          onChange={(event) =>
            setSelected((prev) => ({ ...prev, district: event.target.value }))
          }
        >
          <option value="">All districts</option>
          {(selected.state
            ? filters.stateDistrictMap[selected.state] || []
            : filters.districts
          ).map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        <select
          value={selected.category}
          onChange={(event) =>
            setSelected((prev) => ({ ...prev, category: event.target.value }))
          }
        >
          <option value="">All categories</option>
          {filters.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={selected.season}
          onChange={(event) =>
            setSelected((prev) => ({ ...prev, season: event.target.value }))
          }
        >
          <option value="">All seasons</option>
          {filters.seasons.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
      </div>

      {recommendations.length ? (
        <div className="recommendation-strip">
          {recommendations.map((item) => (
            <article key={item._id} className="recommendation-card">
              <strong>{item.name}</strong>
              <span>
                {item.district}, {item.state}
              </span>
              <p>{item.reason}</p>
            </article>
          ))}
        </div>
      ) : null}

      <div className="crops-grid">
        {crops.length ? (
          crops.map((crop) => (
            <CropCard
              key={crop._id}
              crop={crop}
              quantity={quantities[crop._id]}
              prediction={predictionMap[crop._id]}
              predictionLoading={Boolean(predictionLoadingMap[crop._id])}
              onPredict={handlePrediction}
              onQuantityChange={handleQuantityChange}
              onAdd={handleAddToCart}
              canOrder={Boolean(user)}
            />
          ))
        ) : (
          <div className="empty-state">No crops match the current state, district, or search filters.</div>
        )}
      </div>
    </div>
  );
};

export default Crops;
