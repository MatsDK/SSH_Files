import { useEffect, useState } from "react";
import styles from "../src/css/index.module.css";
import Layout from "../src/components/Layout";
import PresetContainer from "../src/components/PresetContainer";
import LastConnection from "../src/components/LastConnection";
import { LastConnectionData } from "../src/components/SshConnect";

interface ConnectionPreset {
  id: string;
  name: string;
  hostIp: string;
  userName: string;
  port: number;
}

export type PresetData = {
  lastConnections: LastConnectionData[];
  connectionPresets: ConnectionPreset[];
};

const Index = () => {
  const [data, setData] = useState<PresetData>({
    lastConnections: [],
    connectionPresets: [],
  });
  // const [nameInput, setNameInput] = useState<string>("");
  // const [hostInput, setHostInput] = useState<string>("");
  // const [usernameInput, setUsernameInput] = useState<string>("");
  // const [portInput, setPortInput] = useState<number>(22);

  useEffect(() => {
    try {
      setData(
        JSON.parse(
          localStorage.getItem("data") ||
            "{connectionPresents: [], lastConnecetions: []}"
        )
      );
    } catch {}
  }, []);

  // const createPreset = (e: FormEvent) => {
  //   e.preventDefault();

  //   const newConnectionPresets: ConnectionPreset[] = [
  //     {
  //       id: nanoid(),
  //       userName: usernameInput,
  //       hostIp: hostInput,
  //       name: nameInput,
  //       port: portInput,
  //     },
  //     ...data.connectionPresets,
  //   ];

  //   setData((data) => ({ ...data, connectionPresets: newConnectionPresets }));
  //   localStorage.setItem(
  //     "data",
  //     JSON.stringify({ ...data, connectionPresets: newConnectionPresets })
  //   );
  // };

  return (
    <Layout>
      <div className={styles.hostsContainer}>
        <h2>Hosts</h2>

        {(data.lastConnections || []).length ? (
          <div className={styles.lastConnectionsSection}>
            <span>Latest Connections</span>
            {(data.lastConnections || []).map((connection, idx) => {
              if (idx > 1) return null;

              return <LastConnection key={idx} connection={connection} />;
            })}
          </div>
        ) : null}
        <div className={styles.hostsSection}>
          <span>Hosts</span>
          {data.connectionPresets.map((_: ConnectionPreset, idx: number) => (
            <PresetContainer
              data={data}
              setData={(data) => {
                setData(data);
              }}
              preset={_}
              key={idx}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
