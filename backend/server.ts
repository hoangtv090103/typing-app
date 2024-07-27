const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/typingSessionRoutes");
const textRoutes = require("./routes/textRoutes");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/sessions", sessionRoutes);
app.use("/api/v1/texts", textRoutes);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
