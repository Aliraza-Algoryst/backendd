import { connectDb } from "./src/db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Express is working on", process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("Error in express connection", err);
  });

