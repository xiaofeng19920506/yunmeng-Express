const express = require("express");
const cors = require("cors");
const connectDB = require("./connection");
const app = express();
connectDB();
app.use(cors());
app.use(express.json({ limit: "500kb" }));

app.listen(3000, () => console.log("Server ready on port 3000."));
module.exports = app;
