import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import rfqRoutes from "./routes/rfq.js";
import quotationRoutes from "./routes/quotation.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "RFQ Marketplace API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/rfqs", rfqRoutes);
app.use("/api/quotations", quotationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});