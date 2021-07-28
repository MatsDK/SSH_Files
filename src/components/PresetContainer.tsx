import { Folder } from "@material-ui/icons";
import Link from "next/link";
import { PresetData } from "pages";
import { useState } from "react";
import styles from "../css/index.module.css";
import { MenuDots, ShellIcon } from "./icons";

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
  data: PresetData;
}

const PresetContainer: React.FC<Props> = ({ preset, setData, data }) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
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
    setData((data: PresetData) => ({
      ...data,
      connectionPresets: data.connectionPresets.filter(
        (_: ConnectionPreset) => _.id != preset.id
      ),
    }));

    localStorage.setItem(
      "data",
      JSON.stringify({
        ...data,
        connectionPresets: (
          JSON.parse(localStorage.getItem("data") || "").connectionPresets || []
        ).filter((_: ConnectionPreset) => _.id != preset.id),
      } as PresetData)
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

    data.connectionPresets[
      data.connectionPresets.findIndex(
        (_: ConnectionPreset) => _.id == updatedPreset.id
      )
    ] = updatedPreset;

    setData({ ...data, connectionPresets: data.connectionPresets });
    localStorage.setItem(
      "data",
      JSON.stringify({
        ...data,
        connectionPresets: data.connectionPresets,
      } as PresetData)
    );
    setShowEditInputs(false);
  };

  return (
    <div className={styles.presetContainer}>
      <div className={styles.presetContainerLeft}>
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
        </div>
        <div>
          <span className={styles.label}>
            {showEditInput ? (
              <div style={{ display: "flex" }}>
                <input
                  value={editUsernameInput}
                  onChange={(e) => setEditUsernameInput(e.target.value)}
                  type="text"
                />
                @
                <input
                  value={editHostInput}
                  onChange={(e) => setEditHostInput(e.target.value)}
                  type="text"
                />
                <label>Port: </label>
                <input
                  style={{ width: "50px " }}
                  value={editPortInput}
                  onChange={(e) => setEditPortInput(Number(e.target.value))}
                  type="number"
                />
              </div>
            ) : (
              `${preset.userName}@${preset.hostIp} Port: ${preset.port}`
            )}
          </span>
        </div>
      </div>
      <div className={styles.presetContainerRight}>
        <div
          tabIndex={2}
          onBlur={(e) => {
            if ((e.relatedTarget as any)?.nodeName !== "BUTTON")
              setShowDropDown(false);
          }}
          onClick={() => setShowDropDown((showDropDown) => !showDropDown)}
        >
          <MenuDots />
          {showDropDown && (
            <div className={styles.dropDownMenu}>
              <button
                onClick={() => {
                  setShowEditInputs((_) => !_);
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  removePreset();
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
        <div>
          {showEditInput ? (
            <button className={styles.saveButton} onClick={() => saveChanges()}>
              Save
            </button>
          ) : (
            <>
              <Link href={`/shell?${createShellLink()}`}>
                <a
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ShellIcon color={"var(--secondaryTextColor)"} />
                </a>
              </Link>

              <Link href={`/files?${createShellLink()}`}>
                <div className={styles.link}>
                  <Folder />
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresetContainer;
