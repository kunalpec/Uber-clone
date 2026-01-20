import app from "./app.js";
import http from "http";
import dotenv from "dotenv";

// PART-0 create the connection to environment
dotenv.config();

// PART-1 create server
const server = http.createServer(app);

// PART-2 listen server
server.listen(process.env.PORT1 || 4000, () => {
  console.log(`Server is running at port:${process.env.PORT1}`);
});
