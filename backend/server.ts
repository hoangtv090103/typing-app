const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/userRoutes");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);
connectDB();

// Limit request from the same API
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
});

app.use("/api", limiter);
app.use("/api/v1/users", userRoutes);


const PORT = process.env.PORT;

console.log(PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
