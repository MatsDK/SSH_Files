import Layout from "../src/components/Layout";
import Link from "next/link";
import PresetContainer from "src/components/PresetContainer";
import styles from "../src/css/index.module.css";
import { ShellIcon } from "src/components/icons";
import { Folder } from "@material-ui/icons";
import { FormEvent, useEffect, useState } from "react";
import { nanoid } from "nanoid";

interface ConnectionPreset {
  id: string;
  name: string;
  hostIp: string;
  userName: string;
  port: number;
}

type PresetData = { connectionPresets: ConnectionPreset[] };

const Index = () => {
  const [data, setData] = useState<PresetData>({
    connectionPresets: [],
  });
  const [nameInput, setNameInput] = useState<string>("");
  const [hostInput, setHostInput] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [portInput, setPortInput] = useState<number>(22);

  useEffect(() => {
    try {
      setData(
        JSON.parse(localStorage.getItem("data") || "{connectionPresents: []}")
      );
    } catch {}
  }, []);

  const createPreset = (e: FormEvent) => {
    e.preventDefault();

    const newConnectionPresets: ConnectionPreset[] = [
      {
        id: nanoid(),
        userName: usernameInput,
        hostIp: hostInput,
        name: nameInput,
        port: portInput,
      },
      ...data.connectionPresets,
    ];

    setData((data) => ({ ...data, connectionPresets: newConnectionPresets }));
    localStorage.setItem(
      "data",
      JSON.stringify({ ...data, connectionPresets: newConnectionPresets })
    );
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.presetContainer + " " + styles.newContainer}>
          <Link href="/files">
            <div className={styles.newContainerItem}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Folder />
                <h3 style={{ marginLeft: 10, fontSize: 20 }}>Files</h3>
              </div>
              <p style={{ fontWeight: "normal" }}>Open a new files window</p>
            </div>
          </Link>
          <Link href="/shell">
            <div className={styles.newContainerItem}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ShellIcon color="#fff" />
                <h3 style={{ marginLeft: 10, fontSize: 20 }}>Shell</h3>
              </div>
              <p style={{ fontWeight: "normal" }}>Open a new Shell window</p>
            </div>
          </Link>
        </div>
        <div className={styles.presetContainer}>
          <form className={styles.newPresetForm} onSubmit={createPreset}>
            <h3 style={{ margin: 0 }}>Create Preset</h3>
            <div className={styles.newPresetsInput}>
              <div>
                <p>Name: </p>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  type="text"
                />
              </div>
              <div>
                <p>Host: </p>
                <input
                  value={hostInput}
                  onChange={(e) => setHostInput(e.target.value)}
                  type="text"
                />
              </div>
              <div>
                <p>Username: </p>
                <input
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  type="text"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p>Port: </p>
                  <input
                    value={portInput}
                    onChange={(e) => setPortInput(Number(e.target.value))}
                    type="number"
                  />
                </div>
                <button type="submit">Create</button>
              </div>
            </div>
          </form>
        </div>
        {data.connectionPresets.map((_: ConnectionPreset, idx: number) => (
          <PresetContainer preset={_} key={idx} />
        ))}
      </div>
    </Layout>
  );
};

export default Index;
