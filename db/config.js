const mongoose = require("mongoose");

const connectWithRetry = () => {
  return mongoose.connect(
      "mongodb+srv://avi116:Tech1216@cluster0.xsxuhan.mongodb.net/RoveIndia?retryWrites=true&w=majority&appName=Cluster0",
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

connectWithRetry();
