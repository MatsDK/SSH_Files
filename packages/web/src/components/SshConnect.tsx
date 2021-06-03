import axios from "axios";
import { useState } from "react";
import _ from "../parseData";
import DataContainer from "./DataContainer";

interface sshConnectProps {
  selected: { setSelectedData: any; selectedData: any };
}

const SshConnect = (props: sshConnectProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [sshData, setSshData] = useState<object[]>([]);
  const [sshConnectionData, setSshConnectionData] = useState<
    object | undefined
  >();
  const [hostInput, setHostInput] = useState<string>("192.168.0.214");
  const [usernameInput, setUsernameInput] = useState<string>("mats");
  const [passwordInput, setPasswordInput] = useState<string>("mats");

  const connect = (e: any) => {
    try {
      e.preventDefault();

      if (
        !hostInput.replace(/\s/g, "").length ||
        !passwordInput.replace(/\s/g, "").length ||
        !usernameInput.replace(/\s/g, "").length
      )
        return alert("invalid input");

      const connectionData = {
        host: hostInput,
        password: passwordInput,
        username: usernameInput,
      };

      setLoading(true);
      axios({
        method: "POST",
        url: "http://localhost:3001/connectSSH",
        data: connectionData,
      }).then((res) => {
        setLoading(false);
        if (res.data.err) return alert(res.data.data);
        setIsConnected(res.data.connected);
        if (res.data.connected) {
          setSshConnectionData(connectionData);
          setSshData(_.parseRemoteData(JSON.parse(res.data.data)[0].contents));
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="Page">
      {!isConnected ? (
        loading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={connect} className="sshConnectForm">
            <label>Host Name</label>
            <input
              type="text"
              placeholder="host"
              defaultValue={hostInput}
              onChange={(e: any) => setHostInput(e.target.value)}
            />
            <label>UserName</label>
            <input
              type="text"
              placeholder="username"
              defaultValue={usernameInput}
              onChange={(e: any) => setUsernameInput(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="password"
              defaultValue={passwordInput}
              onChange={(e: any) => setPasswordInput(e.target.value)}
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
