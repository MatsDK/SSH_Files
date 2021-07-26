import { Folder } from "@material-ui/icons";
import Link from "next/link";
import styles from "../css/index.module.css";
import { DevicesIcon, ShellIcon } from "./icons";

const Sidebar = () => {
  return (
    <div className={styles.Sidebar}>
      <div className={styles.SidebarTop} />
      <Link href={"/"}>
        <button>
          <div className={styles.SidebarButtonInner}>
            <DevicesIcon />
          </div>
          <span>Devices</span>
        </button>
      </Link>
      <Link href={"/shell"}>
        <button>
          <div>
            <div className={styles.SidebarButtonInner}>
              <ShellIcon />
            </div>
          </div>
          <span>Shell</span>
        </button>
      </Link>
      <Link href={"/files"}>
        <button>
          <div className={styles.SidebarButtonInner}>
            <Folder />
          </div>
          <span>SFTP</span>
        </button>
      </Link>
    </div>
  );
};

export default Sidebar;
