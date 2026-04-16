// src/app.ts
import express from "express";
import cors from "cors";
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = ["http://localhost:3000"];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 3e3;
app_default.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
