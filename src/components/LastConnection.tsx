import Link from "next/link";
import styles from "../css/index.module.css";
import { LastConnectionData } from "./SshConnect";
import { ShellIcon } from "./icons";
import { Folder } from "@material-ui/icons";

interface Props {
  connection: LastConnectionData;
}

const LastConnection: React.FC<Props> = ({ connection }) => {
  const createShellLink = (): string =>
    `h=${connection.hostIp}&u=${connection.username}&p=${connection.port}`;

  return (
    <div className={styles.lastConnectionWrapper}>
      <div className={styles.lastConnnectionLeft}>
        <span>
          {connection.username}@{connection.hostIp}
        </span>
        <span>Port: {connection.port}</span>
      </div>
      <div>
        <div>
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
        </div>
      </div>
    </div>
  );
};

export default LastConnection;
