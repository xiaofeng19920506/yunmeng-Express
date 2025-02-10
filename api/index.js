const express = require("express");
const cors = require("cors");
const connectDB = require("./connection");
const authRoutes = require("../routes/authRoute.js");
const eventRoutes = require("../routes/eventRoute.js");
const app = express();
connectDB();
app.use(cors());
app.use(express.json({ limit: "500kb" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/event", eventRoutes);

app.listen(3000, () => console.log("Server ready on port 3000."));
module.exports = app;
