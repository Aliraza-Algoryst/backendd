import { userRouter } from "./src/routes/user.route.js";
import express from "express";
import cors from "cors";

var corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));

app.use(express.static("public"));

app.use("/api/v1", userRouter);

export { app };
