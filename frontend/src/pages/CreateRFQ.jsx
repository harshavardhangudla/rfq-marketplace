import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateRFQ() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    description: "",
    quantity: "",
    deliveryLocation: "",
    deadline: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/rfqs", {
        productName: form.productName,
        description: form.description,
        quantity: Number(form.quantity),
        deliveryLocation: form.deliveryLocation,
        deadline: new Date(form.deadline).toISOString(),
      });

      navigate("/buyer");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create RFQ. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="logo">RFQ Marketplace</div>

        <button
          onClick={() => navigate("/buyer")}
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
      </nav>

      <main className="form-page">
        <div className="form-card">
          <h1>Create RFQ</h1>
          <p>
            Tell suppliers what you need and receive competitive quotations.
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>Product / Service Name</label>

            <input
              type="text"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              placeholder="e.g. Office Laptops"
              required
            />

            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what you need..."
              rows="5"
              required
            />

            <div className="form-row">
              <div>
                <label>Quantity</label>

                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  min="1"
                  placeholder="20"
                  required
                />
              </div>

              <div>
                <label>Delivery Location</label>

                <input
                  type="text"
                  name="deliveryLocation"
                  value={form.deliveryLocation}
                  onChange={handleChange}
                  placeholder="Vijayawada"
                  required
                />
              </div>
            </div>

            <label>Quotation Deadline</label>

            <input
              type="datetime-local"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="primary-btn form-submit"
              disabled={loading}
            >
              {loading ? "Creating RFQ..." : "Create RFQ"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateRFQ;