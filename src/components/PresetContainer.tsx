import Link from "next/link";
import styles from "../css/index.module.css";
import { ShellIcon } from "./icons";

interface ConnectionPreset {
  id: string;
  name: string;
  hostIp: string;
  userName: string;
  port: number;
}

interface Props {
  preset: ConnectionPreset;
}

const PresentContainer: React.FC<Props> = ({ preset }) => {
  const createShellLink = () =>
    `h=${preset.hostIp}&u=${preset.userName}&p=${preset.port}`;

  return (
    <div className={styles.presetContainer}>
      <p className={styles.presetHeader}>{preset.name}</p>
      <div>
        <p className={styles.label}>Host:</p>
        <p>{preset.hostIp}</p>
      </div>

      <div>
        <p className={styles.label}>UserName:</p>
        <p>{preset.userName}</p>
      </div>
      <div>
        <p className={styles.label}>Port:</p>
        <p>{preset.port}</p>
      </div>

      <Link href={`/shell?${createShellLink()}`}>
        <a target="_blank" rel="noopener noreferrer">
          <ShellIcon />
        </a>
      </Link>

      <Link href={`/files?${createShellLink()}`}>Files</Link>
    </div>
  );
};

export default PresentContainer;
