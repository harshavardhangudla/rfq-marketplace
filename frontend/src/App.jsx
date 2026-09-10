import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyerDashboard from "./pages/BuyerDashboard";
import CreateRFQ from "./pages/CreateRFQ";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierRFQDetails from "./pages/SupplierRFQDetails";
import BuyerRFQDetails from "./pages/BuyerRFQDetails";

import api from "./services/api";


// ======================================================
// HOME PAGE
// ======================================================

function Home() {
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          RFQ Marketplace
        </div>

        <div className="nav-actions">

          <a href="/login">
            Login
          </a>

          <a
            href="/register"
            className="nav-register"
          >
            Get Started
          </a>

        </div>

      </nav>


      {/* Hero */}
      <main className="hero">

        <div className="hero-content">

          <span className="badge">
            B2B RFQ Marketplace
          </span>

          <h1>
            Connect buyers with
            <br />
            trusted suppliers.
          </h1>

          <p>
            Create requests for quotation, discover
            business opportunities, and receive
            competitive supplier quotations in one place.
          </p>

          <div className="hero-buttons">

            <a
              href="/register"
              className="primary-btn"
            >
              Get Started
            </a>

            <a
              href="/login"
              className="secondary-btn"
            >
              Login
            </a>

          </div>

        </div>


        {/* Example RFQ */}
        <div className="hero-card">

          <div className="card-header">

            <span>
              Active RFQ
            </span>

            <span className="status">
              Open
            </span>

          </div>

          <h3>
            Office Laptops
          </h3>

          <p>
            Need business laptops for our office team
          </p>

          <div className="details">

            <div>
              <span>
                Quantity
              </span>

              <strong>
                20 units
              </strong>
            </div>

            <div>
              <span>
                Location
              </span>

              <strong>
                Vijayawada
              </strong>
            </div>

          </div>

          <div className="card-footer">

            <span>
              Deadline: Sep 30, 2026
            </span>

            <span>
              Open RFQ
            </span>

          </div>

        </div>

      </main>


      {/* Features */}
      <section className="features">

        <div>

          <h3>
            For Buyers
          </h3>

          <p>
            Create RFQs and compare supplier quotations.
          </p>

        </div>


        <div>

          <h3>
            For Suppliers
          </h3>

          <p>
            Discover relevant RFQs and submit
            competitive offers.
          </p>

        </div>


        <div>

          <h3>
            Secure
          </h3>

          <p>
            Role-based access keeps buyer and
            supplier data protected.
          </p>

        </div>

      </section>

    </div>
  );
}


// ======================================================
// PROTECTED ROUTE
// ======================================================

function ProtectedRoute({ children, role }) {

  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {

    if (user.role === "BUYER") {
      return <Navigate to="/buyer" replace />;
    }

    if (user.role === "SUPPLIER") {
      return <Navigate to="/supplier" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}


// ======================================================
// EDIT RFQ
// ======================================================

function EditRFQ() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    description: "",
    quantity: "",
    deliveryLocation: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadRFQ();
  }, [id]);


  const loadRFQ = async () => {

    try {

      const response = await api.get(`/rfqs/${id}`);

      const rfq = response.data;

      setForm({
        productName: rfq.productName,
        description: rfq.description,
        quantity: rfq.quantity,
        deliveryLocation: rfq.deliveryLocation,

        deadline: new Date(rfq.deadline)
          .toISOString()
          .slice(0, 16),
      });

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Unable to load RFQ."
      );

    } finally {

      setLoading(false);

    }
  };


  const handleChange = (event) => {

    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {

      await api.put(`/rfqs/${id}`, {
        ...form,
        quantity: Number(form.quantity),
      });

      setSuccess("RFQ updated successfully.");

      setTimeout(() => {
        navigate(`/buyer/rfq/${id}`);
      }, 800);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Unable to update RFQ."
      );

    } finally {

      setSaving(false);

    }
  };


  if (loading) {
    return (
      <div className="state-card">
        Loading RFQ...
      </div>
    );
  }


  return (

    <div className="dashboard">

      <nav className="dashboard-nav">

        <div className="logo">
          RFQ Marketplace
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/buyer")}
        >
          ← Back to Dashboard
        </button>

      </nav>


      <main className="details-page">

        <section className="details-card edit-card">

          <h1>
            Edit RFQ
          </h1>

          <p className="details-description">
            Update your request for quotation.
          </p>


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          {success && (
            <div className="success-message">
              {success}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <label>
              Product / Service Name
            </label>

            <input
              type="text"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              required
            />


            <label>
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              required
            />


            <label>
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="1"
              required
            />


            <label>
              Delivery Location
            </label>

            <input
              type="text"
              name="deliveryLocation"
              value={form.deliveryLocation}
              onChange={handleChange}
              required
            />


            <label>
              Deadline
            </label>

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
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </form>

        </section>

      </main>

    </div>
  );
}


// ======================================================
// MY QUOTATIONS
// ======================================================

function MyQuotations() {

  const navigate = useNavigate();

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );


  useEffect(() => {
    loadQuotations();
  }, []);


  const loadQuotations = async () => {

    try {

      const response =
        await api.get("/quotations/my");

      setQuotations(response.data);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Unable to load your quotations."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="dashboard">

      <nav className="dashboard-nav">

        <div className="logo">
          RFQ Marketplace
        </div>

        <div className="dashboard-nav-right">

          <span>
            Hello, {user.name || "Supplier"}
          </span>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>

        </div>

      </nav>


      <main className="dashboard-content">

        <div className="dashboard-header">

          <div>

            <h1>
              My Quotations
            </h1>

            <p>
              View quotations you have previously submitted.
            </p>

          </div>

          <button
            className="secondary-btn"
            onClick={() => navigate("/supplier")}
          >
            Browse RFQs
          </button>

        </div>


        {loading && (
          <div className="state-card">
            Loading quotations...
          </div>
        )}


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {!loading &&
          !error &&
          quotations.length === 0 && (

            <div className="state-card">

              <h3>
                No quotations yet
              </h3>

              <p>
                Browse available RFQs and submit your first quotation.
              </p>

            </div>
          )}


        {!loading &&
          !error &&
          quotations.length > 0 && (

            <div className="quotes-grid">

              {quotations.map((quote) => (

                <div
                  className="quote-result-card"
                  key={quote.id}
                >

                  <div className="quote-result-top">

                    <div>

                      <span className="quote-label">
                        RFQ
                      </span>

                      <h3>
                        {quote.rfq?.productName ||
                          "RFQ"}
                      </h3>

                    </div>

                    <div className="quote-price">
                      ₹
                      {Number(
                        quote.quotedPrice
                      ).toLocaleString()}
                    </div>

                  </div>


                  <div className="quote-details">

                    <div>

                      <span>
                        Delivery Time
                      </span>

                      <strong>
                        {quote.deliveryTime}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Submitted
                      </span>

                      <strong>
                        {new Date(
                          quote.createdAt
                        ).toLocaleDateString()}
                      </strong>

                    </div>

                  </div>


                  {quote.message && (

                    <div className="quote-message">

                      <span>
                        Message
                      </span>

                      <p>
                        {quote.message}
                      </p>

                    </div>

                  )}


                  {quote.rfq && (

                    <button
                      className="secondary-btn quote-view-btn"
                      onClick={() =>
                        navigate(
                          `/supplier/rfq/${quote.rfq.id}`
                        )
                      }
                    >
                      View RFQ
                    </button>

                  )}

                </div>

              ))}

            </div>

          )}

      </main>

    </div>
  );
}


// ======================================================
// APP
// ======================================================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================= BUYER ================= */}

        <Route
          path="/buyer"
          element={
            <ProtectedRoute role="BUYER">
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/buyer/create"
          element={
            <ProtectedRoute role="BUYER">
              <CreateRFQ />
            </ProtectedRoute>
          }
        />


        <Route
          path="/buyer/rfq/:id"
          element={
            <ProtectedRoute role="BUYER">
              <BuyerRFQDetails />
            </ProtectedRoute>
          }
        />


        <Route
          path="/buyer/rfq/:id/edit"
          element={
            <ProtectedRoute role="BUYER">
              <EditRFQ />
            </ProtectedRoute>
          }
        />


        {/* ================= SUPPLIER ================= */}

        <Route
          path="/supplier"
          element={
            <ProtectedRoute role="SUPPLIER">
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/supplier/rfq/:id"
          element={
            <ProtectedRoute role="SUPPLIER">
              <SupplierRFQDetails />
            </ProtectedRoute>
          }
        />


        <Route
          path="/supplier/quotations"
          element={
            <ProtectedRoute role="SUPPLIER">
              <MyQuotations />
            </ProtectedRoute>
          }
        />


        {/* ================= UNKNOWN ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;