const mongoose = require("mongoose");

const connectWithRetry = () => {
  return mongoose.connect('mongodb://127.0.0.1:27017/Roveindia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 30000, // 30 seconds
})

    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err.message);
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
