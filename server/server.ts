require("dotenv").config();
import next from "next";
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import indexRouter from "./indexRouter";

// import fs from "fs";
// import FileType from "file-type";
// import path from "path";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(async () => {
    const server: Application = express();
    server.use(cors());
    server.use(bodyParser());

    server.use("/", indexRouter);

    server.get("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(3001, (err?: any): void => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${3001}`);
    });
  })
  .catch((ex: any) => {
    console.error(ex.stack);
    process.exit(1);
  });
