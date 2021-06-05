import axios from "axios";
import { useEffect, useState } from "react";
import _ from "../parseData";
import Files from "./Files";
import SelectDrive from "./SelectDrive";
import { RefreshOutlined } from "@material-ui/icons";
import Link from "next/link";

interface sshDataType {
  host: string;
  username: string;
  password: string;
}

interface dataContainerProps {
  data: { children: object[] };
  location: string;
  sshData?: sshDataType;
  drives?: any[];
  selected: { selectedData: any; setSelectedData: any };
}

const DataContainer = (props: dataContainerProps) => {
  const [path, setPath] = useState<string>("/");
  const [loading, setLoading] = useState<boolean>(false);
  const [pathChanged, setPathChanged] = useState<boolean>(false);
  const [activeDrive, setActiveDrive] = useState<any | undefined>(
    props.drives?.[0].name || ""
  );
  const [data, setData] = useState<object[]>([]);
  const [selection, setSelection] = useState<any>();

  useEffect(() => {
    setData(props.data.children);
  }, [props.data.children]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@simonwep/selection-js").then((selectionArea) => {
        const newSelection = new selectionArea.default({
          selectables: [".item"],
          startareas: [".item span", ".ContainerPlaceHolder"],
          scrolling: {
            speedDivider: 10,
            manualSpeed: 750,
          },
          boundaries: [".dataScrollContainer"],
        })
          .on("start", ({ store, event }: { store: any; event: any }) => {
            if (!event!.ctrlKey && !event!.metaKey) {
              for (const el of store.stored) {
                el.classList.remove("selected");
              }
              newSelection.clearSelection();
            }
          })
          .on("move", ({ store }) => {
            if (store.selected !== props.selected.selectedData) {
              const thisEvent = event as any;
              if (thisEvent && thisEvent?.ctrlKey)
                props.selected.setSelectedData([
                  ...store.selected,
                  ...store.stored,
                ]);
              else props.selected.setSelectedData(store.selected);
            }
            for (const el of store.changed.added) {
              el.classList.add("selected");
            }
            for (const el of store.changed.removed) {
              el.classList.remove("selected");
            }
          })
          .on("stop", () => {
            newSelection.keepSelection();
          });
        setSelection(newSelection);
      });
    }
  }, []);

  const clearSelected = () => {
    if (!selection) return;
    const items = selection.getSelection();
    selection.clearSelection();
    items.forEach((x: Element) => {
      selection.deselect(x);
      x.classList.remove("selected");
    });
    props.selected.setSelectedData([]);
  };

  useEffect(() => {
    clearSelected();
    if (path === "/" && props.drives && activeDrive === props.drives?.[0].name)
      return setData(props.data.children);

    if (!pathChanged) {
      return setPathChanged(true);
    }
    setLoading(true);
    axios({
      method: "POST",
      url: "http://localhost:3001/data",
      data: {
        path: activeDrive + path,
        location: props.location,
        sshData: props.sshData || undefined,
      },
    }).then((res) => {
      setLoading(false);
      if (res.data.err) return alert(res.data.data);

      if (props.location === "local")
        setData(_.parseLocalData(res.data.data.children));

      if (props.location === "remote")
        setData(_.parseRemoteData(res.data.data[0].contents));
    });
  }, [path]);

  const updatePath = (child: any) => {
    if (child.type !== "directory") return;
    setPath(child.path);
    setData(child.children);
  };

  useEffect(() => {
    if (!pathChanged) {
      setActiveDrive(props.drives?.[0].name || "");
      return setPathChanged(true);
    }
    setPath("/");
    fetchData(true);
  }, [activeDrive]);

  const fetchData = (driveChanged: boolean) => {
    setLoading(true);
    axios({
      method: "POST",
      url: "http://localhost:3001/data",
      data: {
        path: `${activeDrive}/${!driveChanged ? path : ""}`,
        location: props.location,
        sshData: props.sshData || undefined,
      },
    }).then((res) => {
      setLoading(false);
      if (res.data.err) return alert(res.data.data);

      if (props.location === "local")
        setData(_.parseLocalData(res.data.data.children));

      if (props.location === "remote")
        setData(_.parseRemoteData(res.data.data[0].contents));
    });
  };

  const createShellLink = () => {
    let link: string = "";

    if (props.sshData?.host) link += `h=${props.sshData.host}&`;
    if (props.sshData?.username) link += `u=${props.sshData.username}`;

    return link;
  };

  return (
    <div className="Page" style={{ flex: 1 }}>
      <div style={{ display: "flex" }}>
        {props.drives && (
          <SelectDrive drives={props.drives} setActiveDrive={setActiveDrive} />
        )}
        <div onClick={() => fetchData(false)} className="RefreshBtn">
          <RefreshOutlined />
        </div>
        {props.location == "remote" && (
          <div className="openShellButton">
            <Link href={`/shell?${createShellLink()}`}>
              <a target="_blank" rel="noopener noreferrer">
                <ShellIcon />
                Terminal
              </a>
            </Link>
          </div>
        )}
      </div>
      {loading ? (
        <div style={{ width: "45vw", marginRight: "20px" }}>Loading...</div>
      ) : (
        <div className="Page" style={{ width: "45vw", marginRight: "20px" }}>
          <Files
            data={data}
            selected={{ ...props.selected, selection, clearSelected }}
            loc={{
              path,
              location: props.location,
              sshData: props.sshData,
              setPath,
            }}
            drive={activeDrive}
            update={updatePath}
          />
        </div>
      )}
    </div>
  );
};

const ShellIcon = () => {
  return (
    <svg
      width="19"
      height="13"
      viewBox="0 0 19 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="19" height="13" rx="3" className="iconBG" fill="#B3B3B3" />
      <rect
        width="0.779272"
        height="4.01366"
        transform="matrix(0.699867 -0.714273 0.699867 0.714273 2 1.55661)"
        fill="#0B0E11"
      />
      <rect
        width="0.80597"
        height="3.89151"
        transform="matrix(-0.699867 -0.714273 0.699867 -0.714273 2.63087 6.64644)"
        fill="#0B0E11"
      />
      <rect x="6" y="6" width="4" height="1" fill="#0B0E11" />
    </svg>
  );
};

export default DataContainer;
