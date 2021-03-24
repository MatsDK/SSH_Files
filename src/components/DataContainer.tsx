import axios from "axios";
import { useEffect, useState } from "react";
import _ from "../parseData";
import Files from "./Files";
import SelectionArea from "@simonwep/selection-js";

interface dataContainerProps {
  data: { children: object[] };
  location: string;
  sshData?: object;
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
    const newSelection = new SelectionArea({
      selectables: [".item"],
      startareas: [".rightDataItem", ".ContainerPlaceHolder"],
      scrolling: {
        speedDivider: 10,
        manualSpeed: 750,
      },
      boundaries: [".Container"],
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
          if (thisEvent!.ctrlKey)
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
    console.log("new Selection Area");
    setSelection(newSelection);
  }, []);

  useEffect(() => {
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
    setLoading(true);

    axios({
      method: "POST",
      url: "http://localhost:3001/data",
      data: {
        path: `${activeDrive}/`,
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
  }, [activeDrive]);

  return (
    <div className="Page" style={{ flex: 1 }}>
      <div style={{ display: "flex" }}>
        {props.drives && (
          <div>
            <select
              onChange={(e) => setActiveDrive(e.target.value.split(" ")[0])}
            >
              {props.drives.map((x: any, i: number) => (
                <option key={i} value={x._mounted}>
                  {x.name} {x.label || x.physical}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {loading ? (
        <div style={{ width: "45vw", marginRight: "20px" }}>Loading...</div>
      ) : (
        <div className="Page" style={{ width: "45vw", marginRight: "20px" }}>
          <Files
            data={data}
            selected={{ ...props.selected, selection }}
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

export default DataContainer;
