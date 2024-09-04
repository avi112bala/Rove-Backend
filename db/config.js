const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;

const connectWithRetry = () => {
  return mongoose.connect(
    uri,
     {
        useNewUrlParser: true,
        useUnifiedTopology: true,
         socketTimeoutMS: 60000, // 60 seconds
          serverSelectionTimeoutMS: 60000,
      }
    )

    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err.message);
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
};

module.exports = { connectWithRetry };
