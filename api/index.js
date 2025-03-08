const express = require("express");
const bodyParser = require("body-parser");
const { notFoundResponse } = require("../utils/responseManager");
const cors = require("cors");

// Routes
const userRoutes = require("../routes/userRoutes");
const leadRoutes = require("../routes/leadRoutes");
const authRoutes = require("../routes/authRoutes");
const bankRoutes = require("../routes/bankRoutes");
const dashboardRoutes = require("../routes/dashboardRoutes");
const rechargeRequestRoutes = require("../routes/rechargeRequestRoutes");
const withdrawRequestRoutes = require("../routes/withdrawRequestRoutes");

const app = express();
const port = 3001;

app.use(cors());
// Middleware
app.use(bodyParser.json());

app.use("/v1/users", userRoutes);
app.use("/v1/leads", leadRoutes);
app.use("/v1/counts", dashboardRoutes);
app.use("/v1/bank", bankRoutes);
app.use("/v1/recharge", rechargeRequestRoutes);
app.use("/v1/withdraws", withdrawRequestRoutes);
app.use("/v1/auth", authRoutes);

// Catch all route for 404 (route not found)
app.use((req, res) => {
  notFoundResponse(res, "Route not found");
});

// Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

module.exports = app; 
