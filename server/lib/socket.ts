import { Socket } from "socket.io";
import { Client } from "ssh2";
const pty = require("node-pty");

export const io = require("socket.io")(8001, {
  cors: {
    origin: "http://localhost:3001",
  },
});

type shellType = { rows: number; cols: number };
type connectDataType = {
  username: string;
  password: string;
  hostname: string;
  port: number;
};
type conf =
  | { type: "local"; shell: shellType; connectData?: connectDataType }
  | { type: "SSH"; shell: shellType; connectData: connectDataType };

io.on("connection", (socket: Socket) => {
  try {
    const connect = ({ type, shell: { rows, cols }, ...rest }: conf) => {
      if (type === "SSH") {
        const { username, password, hostname, port } = rest.connectData!;

        const conn = new Client();

        conn.on("timeout", () => {
          console.log("connection timed out");
          socket.emit("error", "Connection timed out");
        });

        conn.on("err", (err: any) => {
          console.log(err);
          socket.emit("error", "error");
        });

        conn.on("error", (err) => {
          console.log("wrong credentials");
          socket.emit("error", "Wrong credentials");
        });

        conn.on("end", () => {
          "end connection";
        });

        conn
          .on("ready", async () => {
            console.log("Connected");

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
            username,
            port,
            host: hostname,
            password: password,
          });
      } else {
        const term = pty.spawn(undefined, [], {
          cols,
          rows,
          cwd: process.env.HOME,
        });

        socket.on("data", (data: string) => {
          term.write(data.toString());
        });

        term.on("data", (data: string) => {
          socket.emit("data", data.toString());
        });

        socket.on("resize", ({ rows, cols }) => {
          term.resize(rows, cols);
        });
      }
    };

    socket.on("start", (data: conf) => {
      connect(data);
    });
  } catch (err) {
    console.log(err.message);
  }
});
