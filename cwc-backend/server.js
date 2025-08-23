import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Example Schema
const UserSchema = new mongoose.Schema({
  telegramId: String,
  username: String,
  email: String,
});
const User = mongoose.model("User", UserSchema);

// Routes
app.get("/", (req, res) => {
  res.send("CWC Backend Running 🚀");
});

app.post("/add-user", async (req, res) => {
  try {
    const { telegramId, username, email } = req.body;
    const user = new User({ telegramId, username, email });
    await user.save();
    res.json({ success: true, message: "User added!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
