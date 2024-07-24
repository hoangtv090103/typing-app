const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/typingSessionRoutes");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);
connectDB();
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/sessions", sessionRoutes);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
