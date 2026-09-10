import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function BuyerRFQDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <div className="state-card">Loading RFQ...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!rfq) {
    return <div className="state-card">RFQ not found.</div>;
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="logo">RFQ Marketplace</div>

        <button
          className="back-btn"
          onClick={() => navigate("/buyer")}
        >
          ← Back to Dashboard
        </button>
      </nav>

      <main className="details-page">
        <section className="details-card">
          <div className="rfq-card-top">
            <span className="status">Open</span>

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
              <span>Deadline</span>
              <strong>
                {new Date(rfq.deadline).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Quotations Received</span>
              <strong>{rfq.quotations?.length || 0}</strong>
            </div>
          </div>
        </section>

        <section className="quotes-section">
          <div className="quotes-heading">
            <div>
              <h2>Received Quotations</h2>
              <p>Compare offers from suppliers.</p>
            </div>
          </div>

          {!rfq.quotations || rfq.quotations.length === 0 ? (
            <div className="state-card">
              <h3>No quotations yet</h3>
              <p>
                Suppliers have not submitted any quotations for
                this RFQ.
              </p>
            </div>
          ) : (
            <div className="quotes-grid">
              {rfq.quotations.map((quote) => (
                <div className="quote-result-card" key={quote.id}>
                  <div className="quote-result-top">
                    <div>
                      <span className="quote-label">
                        Supplier
                      </span>

                      <h3>
                        {quote.supplier?.name || "Supplier"}
                      </h3>
                    </div>

                    <div className="quote-price">
                      ₹{Number(quote.quotedPrice).toLocaleString()}
                    </div>
                  </div>

                  <div className="quote-details">
                    <div>
                      <span>Delivery Time</span>
                      <strong>{quote.deliveryTime}</strong>
                    </div>

                    <div>
                      <span>Submitted</span>
                      <strong>
                        {new Date(
                          quote.createdAt
                        ).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>

                  {quote.message && (
                    <div className="quote-message">
                      <span>Message</span>
                      <p>{quote.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default BuyerRFQDetails;