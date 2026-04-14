import React from "react";
import "./GovernmentSchemes.css";

const schemes = [
  { id: 1, title: "PM-KISAN", desc: "Income support scheme for farmers" },
  { id: 2, title: "PMFBY", desc: "Crop insurance scheme" },
  { id: 3, title: "Soil Health Card", desc: "Improve soil productivity" },
  { id: 4, title: "Kisan Credit Card", desc: "Easy agricultural loans" },
  { id: 5, title: "eNAM", desc: "National agriculture market platform" },
  { id: 6, title: "Paramparagat Krishi", desc: "Organic farming support" },
  { id: 7, title: "RKVY", desc: "Agriculture development scheme" }
];

const GovernmentSchemes = () => {
  return (
    <div className="schemes-wrapper">
      <div className="schemes-track">
        {schemes.map((scheme) => (
          <div key={scheme.id} className="scheme-item">
            <span className="scheme-icon">🌾</span>
            <span className="scheme-title">{scheme.title}</span>
            <span className="scheme-desc">{scheme.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovernmentSchemes;