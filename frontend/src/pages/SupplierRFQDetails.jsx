import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function SupplierRFQDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    quotedPrice: "",
    deliveryTime: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadRFQ();
  }, [id]);

  const loadRFQ = async () => {
    try {
      const response = await api.get(`/rfqs/${id}`);
      setRfq(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load RFQ."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await api.post("/quotations", {
        rfqId: id,
        quotedPrice: Number(form.quotedPrice),
        deliveryTime: form.deliveryTime,
        message: form.message,
      });

      setSuccess("Quotation submitted successfully.");

      setForm({
        quotedPrice: "",
        deliveryTime: "",
        message: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to submit quotation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="state-card">
        Loading RFQ...
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="state-card">
        <h3>RFQ not found</h3>
        <button
          className="secondary-btn"
          onClick={() => navigate("/supplier")}
        >
          Back to RFQs
        </button>
      </div>
    );
  }

  const isOpen = new Date(rfq.deadline) > new Date();

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="logo">RFQ Marketplace</div>

        <button
          className="back-btn"
          onClick={() => navigate("/supplier")}
        >
          ← Back to RFQs
        </button>
      </nav>

      <main className="details-page">
        <div className="details-grid">

          <section className="details-card">
            <div className="rfq-card-top">
              <span className="status">
                {isOpen ? "Open" : "Closed"}
              </span>

              <span>
                Deadline:{" "}
                {new Date(rfq.deadline).toLocaleDateString()}
              </span>
            </div>

            <h1>{rfq.productName}</h1>

            <p className="details-description">
              {rfq.description}
            </p>

            <div className="detail-items">
              <div>
                <span>Quantity</span>
                <strong>{rfq.quantity}</strong>
              </div>

              <div>
                <span>Delivery Location</span>
                <strong>{rfq.deliveryLocation}</strong>
              </div>

              <div>
                <span>Buyer</span>
                <strong>{rfq.buyer?.name}</strong>
              </div>

              <div>
                <span>Deadline</span>
                <strong>
                  {new Date(rfq.deadline).toLocaleString()}
                </strong>
              </div>
            </div>
          </section>

          <section className="details-card quote-card">
            <h2>Submit Quotation</h2>

            <p>
              Send your best offer to the buyer.
            </p>

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {isOpen ? (
              <form onSubmit={handleSubmit}>
                <label>Quoted Price</label>

                <input
                  type="number"
                  name="quotedPrice"
                  value={form.quotedPrice}
                  onChange={handleChange}
                  placeholder="125000"
                  min="1"
                  required
                />

                <label>Estimated Delivery Time</label>

                <input
                  type="text"
                  name="deliveryTime"
                  value={form.deliveryTime}
                  onChange={handleChange}
                  placeholder="10 business days"
                  required
                />

                <label>Message / Notes</label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Add any information for the buyer..."
                  rows="5"
                />

                <button
                  type="submit"
                  className="primary-btn form-submit"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Quotation"}
                </button>
              </form>
            ) : (
              <div className="state-card">
                <h3>This RFQ is closed</h3>
                <p>The quotation deadline has passed.</p>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

export default SupplierRFQDetails;