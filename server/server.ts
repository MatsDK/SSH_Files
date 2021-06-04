require("dotenv").config();
import next from "next";
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import indexRouter from "./indexRouter";
import { Client } from "ssh2";

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

const io = require("socket.io")(8001, {
  cors: {
    origin: "http://localhost:3001",
  },
});

type conf = { rows: number; cols: number };

io.on("connection", (socket) => {
  const connect = ({ rows, cols }: conf) => {
    const conn = new Client();
    conn
      .on("ready", async () => {
        console.log("Connected");

        conn.exec("tree -J", (err: any, stream: any) => {
          if (err) throw err;

          let x = "";
          stream.stdout.on("data", (res: string) => {
            x += res.toString();
          });

          try {
            JSON.parse(x);
            stream.on("exit", () => {
              socket.emit("fileTree", JSON.parse(x));
            });
          } catch (err) {}
        });

        conn.shell({ rows, cols }, (err: any, stream: any) => {
          if (err) return conn.end();

          socket.on("data", (data: string) => {
            stream.write(data.toString());
          });

          stream.on("data", (data: string) => {
            socket.emit("data", data.toString());
          });

          socket.on("resize", ({ rows, cols }) => {
            stream.setWindow(rows, cols);
          });
        });
      })
      .connect({
        host: "192.168.0.214",
        port: 22,
        username: "mats",
        password: "mats",
      });
  };

  socket.on("start", (data: conf) => {
    connect(data);
  });
});
