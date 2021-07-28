import { nanoid } from "nanoid";
import { ConnectionPreset, PresetData } from "pages";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import styles from "../css/index.module.css";
import { ClosePopupIcon } from "./icons";

interface Props {
  closeForm: () => void;
  data: PresetData;
  setData: Dispatch<SetStateAction<PresetData>>;
}

const AddHostForm: React.FC<Props> = ({ closeForm, data, setData }) => {
  const [nameInput, setNameInput] = useState<string>("");
  const [hostInput, setHostInput] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [portInput, setPortInput] = useState<number>(22);

  const createPreset = (e: FormEvent) => {
    e.preventDefault();

    if (!nameInput || !hostInput || !usernameInput || portInput == null) return;

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

    closeForm();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeForm();
      }}
      className={styles.addHostForm}
    >
      <div className={styles.addFormWrapper}>
        <div className={styles.addFormHeader}>
          <h1>Add New Host</h1>
          <span onClick={() => closeForm()}>
            <ClosePopupIcon />
          </span>
        </div>
        <form onSubmit={createPreset}>
          <label>Name</label>
          <input
            type="text"
            placeholder="name"
            defaultValue={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <label>Host IP</label>
          <input
            type="text"
            placeholder="host"
            defaultValue={hostInput}
            onChange={(e) => setHostInput(e.target.value)}
          />
          <label>Username</label>
          <input
            type="text"
            placeholder="username"
            defaultValue={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <label>
            Port <span>(default: 22)</span>
          </label>
          <input
            type="number"
            placeholder="port"
            defaultValue={portInput}
            onChange={(e) => setPortInput(Number(e.target.value))}
          />
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
};

export default AddHostForm;
