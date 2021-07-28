import { useEffect, useRef, useContext, useState } from "react";
import { SocketContext } from "../context/socket";
import "../../node_modules/xterm/css/xterm.css";
import { useRouter } from "next/router";
import { AlertProvider } from "src/context/alert";
import Select from "react-select";
import { styles } from "./ui/selectStyles";
import Layout from "./Layout";
import { LastConnectionData } from "./SshConnect";
import { saveConnectionData } from "../saveConnectionData";

interface PresetOption {
  value: string;
  label: string;
}

interface ConnectionPreset {
  id: string;
  name: string;
  hostIp: string;
  userName: string;
  port: number;
}

type ShellType = {
  cols: number;
  rows: number;
};

interface ConnectParams {
  type: "SSH" | "local";
  shell: ShellType;
  connectData?: {
    hostname: string;
    username: string;
    port: number;
    password: string;
  };
}

const TerminalComponent: React.FC<{}> = () => {
  const router = useRouter();
  const {
    u = "",
    h = "",
    p = 22,
  }: { u?: string; h?: string; p?: number } = router.query;
  const { setAlert } = useContext(AlertProvider);
  const container = useRef<any>();
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [connType, setConnType] = useState<"SSH" | "local" | null>(null);
  const [shellOptions, setShellOptions] = useState<ShellType>({
    rows: 0,
    cols: 0,
  });
  const [hostnameInput, setHostnameInput] = useState<string>(h);
  const [usernameInput, setUsernameInput] = useState<string>(u);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [portInput, setPortInput] = useState<number | null>(Number(p));
  const [connectionData, setConnectionData] =
    useState<LastConnectionData | null>(null);
  const socket = useContext(SocketContext);

  const [sshPresets, setSshPresets] = useState<ConnectionPreset[]>([]);
  const [sshPresetOptions, setSshPresetOptions] = useState<PresetOption[]>([]);

  useEffect(() => {
    try {
      if (localStorage) {
        setSshPresets(
          JSON.parse(localStorage.getItem("data") || "").connectionPresets || []
        );

        setSshPresetOptions(
          (
            JSON.parse(localStorage.getItem("data") || "").connectionPresets ||
            []
          ).map((_) => ({ value: _.id, label: _.name }))
        );
      }
    } catch {}

    return () => {};
  }, []);

  useEffect(() => {
    setPortInput(Number(p));
    setHostnameInput((router.query.h as string) || "");
    setUsernameInput((router.query.u as string) || "");
  }, [router]);

  const selectPreset = (e: PresetOption) => {
    const thisOption: ConnectionPreset | undefined = sshPresets.find(
      (_: ConnectionPreset) => _.id == e.value
    );
    if (!thisOption) return;

    setUsernameInput(() => thisOption.userName);
    setHostnameInput(() => thisOption.hostIp);
    setPortInput(() => thisOption.port);
  };

  useEffect(() => {
    if (isStarted && connectionData && connType === "SSH")
      saveConnectionData(connectionData);
  }, [connectionData, isStarted, connType]);

  useEffect(() => {
    if (!container.current) return;

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

          term.onData((data: string) => {
            socket.emit("data", data.toString());
          });
        };
        fitAddon.fit();

        const prompt = (term: any) => term.write("\r\n$");
        runTerminal();

        socket &&
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
            if (isStarted) {
              fitAddon.fit();
              socket &&
                socket.emit("resize", { cols: term.cols, rows: term.rows });
            }
          },
          false
        );
      });
    });

    return () => {
      container.current = undefined;
    };
  }, [container, socket]);

  const connect = (type: "SSH" | "local", e?: any) => {
    e && e.preventDefault();

    setConnectionData({
      hostIp: hostnameInput,
      username: usernameInput,
      port: portInput || 22,
    });

    const connectParams: ConnectParams = {
      type,
      shell: shellOptions,
    };
    if (type === "SSH") {
      setConnType("SSH");
      connectParams.connectData = {
        password: passwordInput,
        hostname: hostnameInput,
        username: usernameInput,
        port: portInput || 22,
      };
    } else setConnType("local");

    socket && socket.emit("start", connectParams);
  };

  socket &&
    socket.on("error", (data: string) => setAlert({ text: data, show: true }));

  return (
    <>
      {!isStarted && (
        <Layout>
          <div className="sshFormWrapper">
            <form onSubmit={(e) => connect("SSH", e)} className="sshShellForm">
              <h2>Shell</h2>
              <button type={"button"} onClick={() => connect("local")}>
                Open local shell
              </button>
              <label>Connection Presets</label>
              <div style={{ width: 225, height: 40, marginBottom: 10 }}>
                <Select
                  clearable={true}
                  instanceId={`select${1}`}
                  className="Select"
                  isSearchable={true}
                  options={sshPresetOptions}
                  styles={styles}
                  onChange={(e: any) => selectPreset(e)}
                />
              </div>
              <label>Hostname</label>
              <input
                value={hostnameInput}
                placeholder="hostname"
                onChange={(e) => setHostnameInput(e.target.value)}
              />
              <label>Username</label>
              <input
                value={usernameInput}
                placeholder="username"
                onChange={(e) => setUsernameInput(e.target.value)}
              />
              <label>Password</label>
              <input
                type="password"
                value={passwordInput}
                placeholder="password"
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <label>
                Port <span>(default: 22)</span>
              </label>
              <input
                type="number"
                value={portInput || ""}
                placeholder="port"
                onChange={(e) => setPortInput(parseInt(e.target.value || ""))}
              />
              <button type="submit">connect</button>
            </form>
          </div>
        </Layout>
      )}
      <Layout>
        <div
          style={{
            width: "100%",
            height: "calc(100% - 20px)",
            visibility: isStarted ? "visible" : "hidden",
          }}
          ref={container}
        />
      </Layout>
    </>
  );
};

export default TerminalComponent;
