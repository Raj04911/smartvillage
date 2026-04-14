import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <nav className="navbar">
        <div className="logo">🌾 SmartVillage</div>

        <div className="nav-links">
          <span>Home</span>
          <span>Features</span>
          <span>About</span>
        </div>

        <div className="nav-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button className="signup-btn" onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-content">
          <h1>
            The Future of <span>Agriculture Commerce</span>
          </h1>

          <p>
            Connecting farmers directly with consumers through a digital ecosystem
            that ensures transparency, fair pricing, and real-time tracking.
          </p>

          <div className="hero-buttons">
            <button onClick={() => navigate("/login")}>
              Start Buying
            </button>
            <button className="secondary">
              Explore Platform
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <h2>10K+</h2>
              <p>Users</p>
            </div>
            <div>
              <h2>500+</h2>
              <p>Farmers</p>
            </div>
            <div>
              <h2>2K+</h2>
              <p>Orders</p>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854" alt="" />
        </div>
      </section>
      <section className="features">
        <h2>Powerful Features</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <h3>Direct Farming Network</h3>
            <p>Eliminate middlemen and connect directly with farmers.</p>
          </div>

          <div className="feature-card">
            <h3>Smart Order Tracking</h3>
            <p>Track your orders from placement to delivery in real-time.</p>
          </div>

          <div className="feature-card">
            <h3>Advanced Dashboard</h3>
            <p>View analytics, spending insights, and order history.</p>
          </div>

          <div className="feature-card">
            <h3>🛠 Admin Control Panel</h3>
            <p>Manage crops, users, and orders efficiently.</p>
          </div>

        </div>
      </section>
      <section className="about">
        <div className="about-content">
          <h2>Revolutionizing Rural Economy</h2>
          <p>
            Our platform bridges the gap between farmers and consumers,
            ensuring transparency, better profits, and sustainable growth.
          </p>
        </div>

        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95" alt="" />
        </div>
      </section>

      <section className="testimonials">
        <h2>What People Say</h2>

        <div className="testimonial-grid">
          <div className="testimonial">
            <p>"Best platform to buy fresh crops directly!"</p>
            <span>- Rahul</span>
          </div>

          <div className="testimonial">
            <p>"Farmers are finally getting fair prices."</p>
            <span>- Priya</span>
          </div>

          <div className="testimonial">
            <p>"Amazing experience and easy to use."</p>
            <span>- Amit</span>
          </div>
        </div>
      </section>
      <section className="cta">
        <h2>Join the Future of Farming 🚀</h2>
        <p>Start your journey with Smart Village Marketplace today</p>

        <button onClick={() => navigate("/login")}>
          Get Started Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 Smart Village | Built with </p>
      </footer>

    </div>
  );
};

export default Landing;