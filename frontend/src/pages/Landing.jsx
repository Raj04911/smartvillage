import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import api from "../utils/api";
import "./Landing.css";

const landingFeatures = [
  "Public crop browsing without forced login",
  "District-wise crop demand and recommendations",
  "AI-led price outlook ready for OpenRouter",
  "Live admin insights from MongoDB data"
];

const Landing = () => {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", {
        opacity: 0,
        y: 32,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out"
      });

      gsap.from(".signal-card", {
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.7,
        delay: 0.3,
        ease: "back.out(1.6)"
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await api.get("/orders/reviews/all");
        setReviews(response.data.reviews);
      } catch (error) {
        console.error(error);
      }
    };

    loadReviews();
  }, []);

  const activeReview = reviews[reviewIndex];

  return (
    <div className="landing-shell" ref={rootRef}>
      <header className="landing-nav">
        <div className="brand-mark">Smart Crop Grid</div>
        <nav className="nav-cluster">
          <button onClick={() => navigate("/marketplace")}>Explore Crops</button>
          <button onClick={() => navigate("/login")}>Login</button>
          <button className="nav-primary" onClick={() => navigate("/signup")}>
            Signup
          </button>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-grid">
          <div className="hero-copy">
            <span className="hero-kicker">District-aware agriculture intelligence</span>
            <h1>Buy, predict, and manage crops with live data instead of guesswork.</h1>
            <p>
              Smart Dashboard System blends public crop access, district-level demand,
              admin monitoring, and AI prediction into one faster farming marketplace.
            </p>
            <div className="hero-actions">
              <button className="hero-primary" onClick={() => navigate("/marketplace")}>
                View Public Crops
              </button>
              <button className="hero-secondary" onClick={() => navigate("/signup")}>
                Create Account
              </button>
            </div>
            <div className="hero-band">
              <div>
                <strong>12+</strong>
                <span>district market lanes</span>
              </div>
              <div>
                <strong>AI</strong>
                <span>prediction ready</span>
              </div>
              <div>
                <strong>Live</strong>
                <span>admin revenue view</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />
            <div className="hero-panel">
              <div className="panel-header">
                <span>Market Pulse</span>
                <strong>+14.2%</strong>
              </div>
              <div className="signal-grid">
                {landingFeatures.map((feature) => (
                  <div key={feature} className="signal-card">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="value-strip">
          <article>
            <span>01</span>
            <h3>Open marketplace</h3>
            <p>Anyone can browse crops first and decide later without forced authentication.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Localized crop logic</h3>
            <p>Recommendations shift with state and district so supply matches real geography.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Operational admin</h3>
            <p>Orders, users, revenue, and top-performing crops are pulled from the database.</p>
          </article>
        </section>

        <section className="reviews-section">
          <div className="reviews-header">
            <div>
              <span className="hero-kicker">Customer Reviews</span>
              <h2>See what customers are saying after delivery.</h2>
            </div>
            {reviews.length > 1 ? (
              <button
                className="hero-secondary"
                onClick={() => setReviewIndex((prev) => (prev + 1) % reviews.length)}
              >
                Next Review
              </button>
            ) : null}
          </div>

          {activeReview ? (
            <div className="review-card">
              <strong>{activeReview.userName}</strong>
              <span>{activeReview.cropName}</span>
              <p>{activeReview.comment}</p>
              <div className="review-rating">{activeReview.rating}/5</div>
            </div>
          ) : (
            <div className="review-card">
              <strong>No reviews yet</strong>
              <p>Delivered order reviews will appear here one at a time.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Landing;
