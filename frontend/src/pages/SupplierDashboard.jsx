import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function SupplierDashboard() {
  const navigate = useNavigate();

  const [rfqs, setRfqs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadRfqs();
  }, []);

  const loadRfqs = async (searchValue = "", locationValue = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/rfqs", {
        params: {
          search: searchValue || undefined,
          location: locationValue || undefined,
        },
      });

      setRfqs(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load available RFQs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadRfqs(search, location);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="logo">RFQ Marketplace</div>

        <div className="dashboard-nav-right">
          <span>Hello, {user.name || "Supplier"}</span>

          <button onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Supplier Dashboard</h1>
            <p>
              Discover RFQs and submit competitive quotations.
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => navigate("/supplier/quotations")}
          >
            My Quotations
          </button>
        </div>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products or services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="text"
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button type="submit" className="primary-btn">
            Search
          </button>
        </form>

        {loading && (
          <div className="state-card">
            Loading available RFQs...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && rfqs.length === 0 && (
          <div className="state-card">
            <h3>No RFQs found</h3>
            <p>
              Try changing your search or check again later.
            </p>
          </div>
        )}

        {!loading && rfqs.length > 0 && (
          <div className="rfq-grid">
            {rfqs.map((rfq) => (
              <div className="rfq-card" key={rfq.id}>
                <div className="rfq-card-top">
                  <span className="status">
                    {new Date(rfq.deadline) > new Date()
                      ? "Open"
                      : "Closed"}
                  </span>

                  <span>
                    {new Date(rfq.deadline).toLocaleDateString()}
                  </span>
                </div>

                <h3>{rfq.productName}</h3>

                <p>{rfq.description}</p>

                <div className="rfq-info">
                  <div>
                    <span>Quantity</span>
                    <strong>{rfq.quantity}</strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>{rfq.deliveryLocation}</strong>
                  </div>
                </div>

                <div className="rfq-deadline">
                  Buyer: {rfq.buyer?.name || "Buyer"}
                </div>

                <button
                  className="secondary-btn rfq-view-btn"
                  onClick={() =>
                    navigate(`/supplier/rfq/${rfq.id}`)
                  }
                >
                  View RFQ
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SupplierDashboard;