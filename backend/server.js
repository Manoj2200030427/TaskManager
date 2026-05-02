require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors"); // ✅ add this

const app = express();

app.use(cors()); // ✅ VERY IMPORTANT
app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes")); // ✅ only once

app.listen(5000, () => console.log("Server running"));