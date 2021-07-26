import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AlertProvider } from "src/context/alert";
import _ from "../parseData";
import { sshConnectionData } from "./Container";
import DataContainer from "./DataContainer";
import Select from "react-select";
import { styles } from "./ui/selectStyles";

interface sshConnectProps {
  selected: { setSelectedData: any; selectedData: any };
  sshConnectionData: sshConnectionData;
}

interface sshDataType {
  host: string;
  username: string;
  password: string;
  port: number;
}

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

const SshConnect: React.FC<sshConnectProps> = (props) => {
  const { setAlert } = useContext(AlertProvider);
  const [loading, setLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [sshData, setSshData] = useState<object[]>([]);
  const [sshConnectionData, setSshConnectionData] = useState<
    sshDataType | undefined
  >();
  const [hostInput, setHostInput] = useState<string>(
    props.sshConnectionData.host || ""
  );
  const [usernameInput, setUsernameInput] = useState<string>(
    props.sshConnectionData.userName || ""
  );
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [portInput, setPortInput] = useState<number>(
    props.sshConnectionData.port == null ? 22 : props.sshConnectionData.port
  );
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

  const connect = (e: any) => {
    try {
      e.preventDefault();

      if (
        !hostInput.replace(/\s/g, "").length ||
        !passwordInput.replace(/\s/g, "").length ||
        !usernameInput.replace(/\s/g, "").length
      )
        return setAlert({ text: "invalid input", show: true });

      const connectionData = {
        host: hostInput,
        password: passwordInput,
        username: usernameInput,
        port: portInput || 22,
      };

      setLoading(true);
      axios({
        method: "POST",
        url: "http://localhost:3001/connectSSH",
        data: connectionData,
      }).then((res) => {
        setLoading(false);
        if (res.data.err) return setAlert({ text: res.data.data, show: true });
        setIsConnected(res.data.connected);
        if (res.data.connected) {
          setSshConnectionData(connectionData);
          setSshData(_.parseRemoteData(JSON.parse(res.data.data)[0].contents));
        }
      });
    } catch (err) {
      console.log(err);
      setAlert({ text: "error", show: true });
    }
  };

  const selectPreset = (e: PresetOption) => {
    const thisOption: ConnectionPreset | undefined = sshPresets.find(
      (_: ConnectionPreset) => _.id == e.value
    );
    if (!thisOption) return;

    setUsernameInput(() => thisOption.userName);
    setHostInput(() => thisOption.hostIp);
    setPortInput(() => thisOption.port);
  };

  return (
    <div className="Page">
      {!isConnected ? (
        loading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={connect} className="sshConnectForm">
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
            <label>Host Name</label>
            <input
              type="text"
              placeholder="host"
              value={hostInput}
              onChange={(e: any) => setHostInput(e.target.value)}
            />
            <label>UserName</label>
            <input
              type="text"
              placeholder="username"
              value={usernameInput}
              onChange={(e: any) => setUsernameInput(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="password"
              value={passwordInput}
              onChange={(e: any) => setPasswordInput(e.target.value)}
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
            <button type="submit">Connect</button>
          </form>
        )
      ) : (
        <DataContainer
          data={{ children: sshData }}
          sshData={sshConnectionData}
          location="remote"
          selected={{
            ...props.selected,
          }}
        />
      )}
    </div>
  );
};
export default SshConnect;
