import app from "./app.js";
import initDatabase from "./config/seed.js";
import startOtpCleanupJob from "./jobs/otpCleanup.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  await initDatabase();
  console.log("Database initialized.");

  startOtpCleanupJob();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});