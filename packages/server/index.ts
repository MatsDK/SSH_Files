import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import indexRouter from "./src/indexRouter";

const server: Application = express();
server.use(cors());
server.use(bodyParser.json());

server.use("/", indexRouter);

server.listen(3001, (err?: any): void => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${3001}`);
});
