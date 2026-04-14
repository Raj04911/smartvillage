import React from "react";
import { schemesData } from "../../data/schemsData";
import "./Schemes.css";

const Schemes = () => {
  return (
    <div className="schemes-page">
      <div className="schemes-header">
        <h2>Government Schemes</h2>
        <p>
          Explore active farmer welfare programs and support initiatives
          provided by the government.
        </p>
      </div>

      <div className="schemes-grid">
        {schemesData.map((scheme) => (
          <div key={scheme.id} className="scheme-card">
            <div className="scheme-card-header">
              <h3>{scheme.title}</h3>
            </div>

            <div className="scheme-card-body">
              <p>{scheme.description}</p>
            </div>

            <div className="scheme-card-footer">
              <button className="apply-btn">
                Apply Now
              </button>
              <button className="details-btn">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schemes;