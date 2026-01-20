import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import { ConnectToDb } from "./db/db.js";

dotenv.config();

const server = http.createServer(app);


ConnectToDb()
  .then(() => {
    server.on("error", (error) => {
      console.error("Server error:", error);
      process.exit(1);
    });

    server.listen(process.env.PORT1 || 4000, () => {
      console.log(`Server running on ${process.env.PORT1 || 4000}`);
    });
  })
  .catch((error) => {
    console.error("DB error:", error);
    process.exit(1);
  });

