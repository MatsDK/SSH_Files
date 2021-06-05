import { useEffect, useRef, useContext, useState } from "react";
import { SocketContext } from "../context/socket";
import "../../node_modules/xterm/css/xterm.css";
import { useRouter } from "next/router";

const TerminalComponent = () => {
  const router = useRouter();
  const { u = "", h = "" }: { u?: string; h?: string } = router.query;
  const container = useRef<any>();
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [shellOptions, setShellOptions] = useState<{
    cols: number;
    rows: number;
  }>({ rows: 0, cols: 0 });
  const [hostnameInput, setHostnameInput] = useState<string>(h);
  const [usernameInput, setUsernameInput] = useState<string>(u);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const socket = useContext(SocketContext);

  useEffect(() => {
    setHostnameInput((router.query.h as string) || "");
    setUsernameInput((router.query.u as string) || "");
  }, [router]);

  useEffect(() => {
    if (container.current) {
      import("xterm").then(({ Terminal }: any) => {
        import("xterm-addon-fit").then(({ FitAddon }: any) => {
          const term = new Terminal();
          term.open(container.current);

          const fitAddon = new FitAddon();
          term.loadAddon(fitAddon);
          fitAddon.fit();

          const runTerminal = () => {
            if (term._initialized) return;

            term._initialized = true;
            prompt(term);

            term.onData((data) => {
              socket.emit("data", data.toString());
            });
          };
          fitAddon.fit();

          const prompt = (term: any) => term.write("\r\n$");
          runTerminal();

          socket.on("data", (data: any) => {
            setIsStarted(true);
            term.write(data);
            term.focus();
            fitAddon.fit();
          });

          setShellOptions({ cols: term.cols, rows: term.rows });

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

  const connect = (e: any) => {
    e.preventDefault();

    socket.emit("start", {
      shell: shellOptions,
      connectData: {
        password: passwordInput,
        hostname: hostnameInput,
        username: usernameInput,
      },
    });
  };

  return (
    <>
      {!isStarted && (
        <form onSubmit={connect}>
          <input
            value={hostnameInput}
            placeholder="hostname"
            onChange={(e) => setHostnameInput(e.target.value)}
          />
          <input
            value={usernameInput}
            placeholder="username"
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <input
            type="password"
            value={passwordInput}
            placeholder="password"
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button type="submit">connect</button>
        </form>
      )}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: isStarted ? "block" : "none",
        }}
        ref={container}
      ></div>
    </>
  );
};

export default TerminalComponent;
