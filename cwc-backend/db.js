const mongoose = require("mongoose");

async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: "cwc" });
  console.log("✅ MongoDB connected");
}

module.exports = { connectDB };
