import express from "express";
import cors from "cors";
import apiRoutes from "routes/api";
import initDatabase from "config/seed";
import errorHandler from "./middlewares/errorHandler";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin: any, callback: any) => {
      const allowed = ["http://localhost:3000"];

      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);



apiRoutes(app);

initDatabase();

app.use((req,res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found."
    });
})

app.use(errorHandler);

export default app;