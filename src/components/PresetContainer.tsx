import { Folder } from "@material-ui/icons";
import Link from "next/link";
import { useState } from "react";
import styles from "../css/index.module.css";
import { ClosePopupIcon, EditIcon, ShellIcon } from "./icons";

interface ConnectionPreset {
  id: string;
  name: string;
  hostIp: string;
  userName: string;
  port: number;
}

interface Props {
  preset: ConnectionPreset;
  setData: any;
  data: ConnectionPreset[];
}

const PresetContainer: React.FC<Props> = ({ preset, setData, data }) => {
  const [showEditInput, setShowEditInputs] = useState<boolean>(false);
  const [editNameInput, setEditNameInput] = useState<string>(preset.name);
  const [editHostInput, setEditHostInput] = useState<string>(preset.hostIp);
  const [editUsernameInput, setEditUsernameInput] = useState<string>(
    preset.userName
  );
  const [editPortInput, setEditPortInput] = useState<number>(preset.port);

  const createShellLink = () =>
    `h=${preset.hostIp}&u=${preset.userName}&p=${preset.port}`;

  const removePreset = () => {
    setData((data) => ({
      connectionPresets: data.connectionPresets.filter(
        (_: ConnectionPreset) => _.id != preset.id
      ),
    }));

    localStorage.setItem(
      "data",
      JSON.stringify({
        connectionPresets: (
          JSON.parse(localStorage.getItem("data") || "").connectionPresets || []
        ).filter((_: ConnectionPreset) => _.id != preset.id),
      })
    );
  };

  const saveChanges = () => {
    const updatedPreset: ConnectionPreset = {
      hostIp: editHostInput,
      userName: editUsernameInput,
      port: editPortInput,
      name: editNameInput,
      id: preset.id,
    };

    data[data.findIndex((_: ConnectionPreset) => _.id == updatedPreset.id)] =
      updatedPreset;

    setData({ connectionPresets: data });
    localStorage.setItem("data", JSON.stringify({ connectionPresets: data }));
    setShowEditInputs(false);
  };

  return (
    <div className={styles.presetContainer}>
      <div className={styles.presetHeaderContainer}>
        <p className={styles.presetHeader}>
          {showEditInput ? (
            <input
              value={editNameInput}
              onChange={(e) => setEditNameInput(e.target.value)}
              type="text"
            />
          ) : (
            preset.name
          )}
        </p>
        <div>
          <div onClick={() => setShowEditInputs((_) => !_)}>
            <EditIcon />
          </div>
          <div onClick={removePreset}>
            <ClosePopupIcon />
          </div>
        </div>
      </div>
      <div>
        <p className={styles.label}>Host:</p>
        <p>
          {showEditInput ? (
            <input
              value={editHostInput}
              onChange={(e) => setEditHostInput(e.target.value)}
              type="text"
            />
          ) : (
            preset.hostIp
          )}
        </p>
      </div>

      <div>
        <p className={styles.label}>UserName:</p>
        <p>
          {showEditInput ? (
            <input
              value={editUsernameInput}
              onChange={(e) => setEditUsernameInput(e.target.value)}
              type="text"
            />
          ) : (
            preset.userName
          )}
        </p>
      </div>
      <div>
        <p className={styles.label}>Port:</p>
        <p>
          {showEditInput ? (
            <input
              value={editPortInput}
              onChange={(e) => setEditPortInput(Number(e.target.value))}
              type="number"
            />
          ) : (
            preset.port
          )}
        </p>
      </div>
      <div className={styles.bottomBar}>
        <div>
          <Link href={`/shell?${createShellLink()}`}>
            <a
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ShellIcon color={"#fff"} />
              <p>Shell</p>
            </a>
          </Link>

          <Link href={`/files?${createShellLink()}`}>
            <div className={styles.link}>
              <Folder />
              <p>Files</p>
            </div>
          </Link>
        </div>
        {showEditInput && <button onClick={saveChanges}>Save</button>}
      </div>
    </div>
  );
};

export default PresetContainer;
