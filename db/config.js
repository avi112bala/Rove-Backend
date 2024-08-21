const mongoose = require("mongoose");

const connectWithRetry = () => {
  return mongoose.connect(
      "mongodb+srv://avi20802bala:Tech1216@cluster0.xsxuhan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        socketTimeoutMS: 30000, // 30 seconds
      }
    )

    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err.message);
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
