import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function BuyerDashboard() {
  const navigate = useNavigate();

  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadRfqs();
  }, []);

  const loadRfqs = async () => {
    try {
      const response = await api.get("/rfqs/my");
      setRfqs(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load your RFQs."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard">

      {/* Navbar */}
      <nav className="dashboard-nav">

        <div className="logo">
          RFQ Marketplace
        </div>

        <div className="dashboard-nav-right">

          <span>
            Hello, {user.name || "Buyer"}
          </span>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </nav>


      {/* Main Content */}
      <main className="dashboard-content">

        <div className="dashboard-header">

          <div>
            <h1>Buyer Dashboard</h1>

            <p>
              Manage your requests for quotation.
            </p>
          </div>

          <Link
            to="/buyer/create"
            className="primary-btn"
          >
            + Create RFQ
          </Link>

        </div>


        {/* Loading */}
        {loading && (
          <div className="state-card">
            Loading your RFQs...
          </div>
        )}


        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* Empty State */}
        {!loading &&
          !error &&
          rfqs.length === 0 && (
            <div className="state-card">

              <h3>
                No RFQs yet
              </h3>

              <p>
                Create your first request for quotation.
              </p>

              <Link
                to="/buyer/create"
                className="primary-btn"
              >
                Create RFQ
              </Link>

            </div>
          )}


        {/* RFQ Cards */}
        {!loading &&
          !error &&
          rfqs.length > 0 && (

            <div className="rfq-grid">

              {rfqs.map((rfq) => {

                const isOpen =
                  new Date(rfq.deadline) > new Date();

                const quoteCount =
                  rfq.quotations?.length || 0;

                return (

                  <div
                    className="rfq-card"
                    key={rfq.id}
                  >

                    {/* Card Top */}
                    <div className="rfq-card-top">

                      <span className="status">
                        {isOpen ? "Open" : "Closed"}
                      </span>

                      <span>
                        {quoteCount}{" "}
                        {quoteCount === 1
                          ? "Quote"
                          : "Quotes"}
                      </span>

                    </div>


                    {/* Product */}
                    <h3>
                      {rfq.productName}
                    </h3>

                    <p>
                      {rfq.description}
                    </p>


                    {/* Info */}
                    <div className="rfq-info">

                      <div>
                        <span>
                          Quantity
                        </span>

                        <strong>
                          {rfq.quantity}
                        </strong>
                      </div>


                      <div>
                        <span>
                          Location
                        </span>

                        <strong>
                          {rfq.deliveryLocation}
                        </strong>
                      </div>

                    </div>


                    {/* Deadline */}
                    <div className="rfq-deadline">

                      Deadline:{" "}
                      {new Date(
                        rfq.deadline
                      ).toLocaleDateString()}

                    </div>


                    {/* View Quotes */}
                    <div className="rfq-actions">

  <button
    className="secondary-btn"
    onClick={() =>
      navigate(`/buyer/rfq/${rfq.id}`)
    }
  >
    {quoteCount > 0
      ? "View Quotes"
      : "View RFQ"}
  </button>

  <button
    className="secondary-btn"
    onClick={() =>
      navigate(`/buyer/rfq/${rfq.id}/edit`)
    }
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={async () => {

      const confirmed = window.confirm(
        "Are you sure you want to delete this RFQ?"
      );

      if (!confirmed) return;

      try {

        await api.delete(`/rfqs/${rfq.id}`);

        setRfqs((current) =>
          current.filter(
            (item) => item.id !== rfq.id
          )
        );

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Unable to delete RFQ."
        );

      }

    }}
  >
    Delete
  </button>

</div>

                  </div>

                );
              })}

            </div>

          )}

      </main>

    </div>
  );
}

export default BuyerDashboard;