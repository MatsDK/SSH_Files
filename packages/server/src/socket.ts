import { Server } from "socket.io";
import { Client } from "ssh2";

const io: Server = require("socket.io")(8001, {
  cors: {
    origin: "http://localhost:8000",
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
