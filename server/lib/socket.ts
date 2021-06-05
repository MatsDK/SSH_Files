import { Client } from "ssh2";

export const io = require("socket.io")(8001, {
  cors: {
    origin: "http://localhost:3001",
  },
});

type shellType = { rows: number; cols: number };
type connectDataType = { username: string; password: string; hostname: string };
type conf = { shell: shellType; connectData: connectDataType };

io.on("connection", (socket) => {
  try {
    const connect = (
      { rows, cols }: shellType,
      { password, username, hostname }: connectDataType
    ) => {
      console.log(password, username, hostname);
      const conn = new Client();

      conn.on("timeout", () => {
        console.log("connection timed out");
      });

      conn.on("err", (err) => {
        console.log(err);
      });

      conn.on("error", (err) => {
        console.log("wrong credentials");
      });

      conn.on("end", () => {
        "end connection";
      });

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
          username,
          host: hostname,
          password: password,
        });
    };

    socket.on("start", ({ shell, connectData }: conf) => {
      connect(shell, connectData);
    });
  } catch (err) {
    console.log(err.message);
  }
});
