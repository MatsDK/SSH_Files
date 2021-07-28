import { useEffect, useState } from "react";
import styles from "../src/css/index.module.css";
import Layout from "../src/components/Layout";
import PresetContainer from "../src/components/PresetContainer";
import LastConnection from "../src/components/LastConnection";
import { LastConnectionData } from "../src/components/SshConnect";
import AddHostForm from "src/components/AddHostForm";

export interface ConnectionPreset {
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
  const [showNewHostForm, setShowNewHostForm] = useState(false);
  const [data, setData] = useState<PresetData>({
    lastConnections: [],
    connectionPresets: [],
  });

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

  return (
    <Layout>
      <div className={styles.hostsContainer}>
        <div className={styles.hostsPageHeader}>
          <h2>Hosts</h2>
          <span onClick={() => setShowNewHostForm(true)}>New Host</span>
        </div>
        {showNewHostForm && (
          <AddHostForm
            closeForm={() => setShowNewHostForm(false)}
            data={data}
            setData={setData}
          />
        )}

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
