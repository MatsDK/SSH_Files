import { useEffect, useRef, useContext } from "react";
import { SocketContext } from "../context/socket";
import "../../../../node_modules/xterm/css/xterm.css";

const TerminalComponent = () => {
  const container = useRef<any>();
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (container.current) {
      import("xterm").then(({ Terminal }: any) => {
        import("xterm-addon-fit").then(({ FitAddon }: any) => {
          const term: any = new Terminal();
          term.open(container.current);

          const fitAddon = new FitAddon();
          term.loadAddon(fitAddon);
          fitAddon.fit();

          const runTerminal = () => {
            if (term._initialized) return;

            term._initialized = true;
            prompt(term);

            term.onData((data) => {
              socket.emit("data", data);
            });
          };
          fitAddon.fit();

          const prompt = (term: any) => term.write("\r\n$ ");
          runTerminal();

          socket.on("data", (data: any) => {
            term.write(data);
            term.focus();
          });
          socket.emit("start", { cols: term.cols, rows: term.rows });

          window.addEventListener(
            "resize",
            () => {
              fitAddon.fit();
              socket.emit("resize", { cols: term.cols, rows: term.rows });
            },
            false
          );
        });
      });
    }

    return () => {
      container.current = undefined;
    };
  }, [container, socket]);

  return (
    <>
      <div style={{ width: "100%", height: "100%" }} ref={container}></div>
    </>
  );
};

export default TerminalComponent;
