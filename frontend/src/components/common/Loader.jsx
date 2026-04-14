import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader-circle"></div>
      <div className="loader-text">
        Loading Dashboard...
      </div>
    </div>
  );
};

export default Loader;