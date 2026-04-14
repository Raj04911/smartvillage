import React, { useState } from "react";
import "./Support.css";

const Support = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "Medium"
  });

  const [tickets, setTickets] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) {
      alert("Please fill all fields");
      return;
    }

    const newTicket = {
      id: Date.now(),
      subject: formData.subject,
      message: formData.message,
      priority: formData.priority,
      status: "Open",
      date: new Date().toLocaleDateString()
    };

    setTickets([newTicket, ...tickets]);

    setFormData({
      subject: "",
      message: "",
      priority: "Medium"
    });
  };

  return (
    <div className="support-page">
      
      <div className="support-header">
        <h2>Support Center</h2>
        <p>We're here to help you with anything</p>
      </div>

      <div className="support-container">

        {/* LEFT SIDE */}
        <div className="support-left">

          <div className="support-card">
            <h3>Create Ticket</h3>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />

              <textarea
                name="message"
                placeholder="Describe your issue..."
                value={formData.message}
                onChange={handleChange}
              />

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <button type="submit">Submit Ticket</button>

            </form>
          </div>

          <div className="support-card">
            <h3>FAQs</h3>

            <div className="faq-item">
              <h4>How to place an order?</h4>
              <p>Add crops to cart and click place order.</p>
            </div>

            <div className="faq-item">
              <h4>How to track order?</h4>
              <p>Go to Orders section to see status.</p>
            </div>

            <div className="faq-item">
              <h4>How to contact admin?</h4>
              <p>Use the support form or email us.</p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="support-right">

          <div className="support-card">
            <h3>Your Tickets</h3>

            {tickets.length === 0 ? (
              <p>No tickets created</p>
            ) : (
              <div className="ticket-list">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="ticket-card">
                    
                    <div className="ticket-top">
                      <span className="ticket-id">#{ticket.id}</span>
                      <span className={`priority ${ticket.priority.toLowerCase()}`}>
                        {ticket.priority}
                      </span>
                    </div>

                    <h4>{ticket.subject}</h4>
                    <p>{ticket.message}</p>

                    <div className="ticket-bottom">
                      <span className={`status ${ticket.status.toLowerCase()}`}>
                        {ticket.status}
                      </span>
                      <span>{ticket.date}</span>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Support;