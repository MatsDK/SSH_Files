import axios from "axios";
import filesize from "filesize";
import mime from "mime";
import { useEffect, useState } from "react";
import _ from "../parseData";
import SelectionArea from "@simonwep/selection-js";

const order = ["directory", "file"];

interface DataItem {
  name: string;
  path: string;
  type: string;
  size: number;
  id: number;
  children?: any[];
}

interface FilesProps {
  data: object[];
  update: any;
  loc: any;
  drive: string;
}

const Files = ({
  data,
  update,
  loc: { path, location, sshData, setPath },
  drive,
}: FilesProps) => {
  const [items, setItems] = useState<object[]>(data);
  const [selection, setSelection] = useState<any>();

  const [selectedData, setSelectedData] = useState<any[]>([]);
  useEffect(() => {
    setItems(data);
  }, [data]);

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
      .on("start", ({ store, event }) => {
        if (!event!.ctrlKey && !event!.metaKey) {
          for (const el of store.stored) {
            el.classList.remove("selected");
          }

          newSelection.clearSelection();
        }
      })
      .on("move", ({ store }) => {
        if (store.selected !== selectedData) setSelectedData(store.selected);
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
  }, []);

  const clearSelected = () => {
    const items = selection.getSelection();
    selection.clearSelection();

    items.forEach((x: Element) => {
      x.classList.remove("selected");
    });
  };

  const dragStart = (e: any, child: DataItem) => {
    let thisData: any[] = [];

    selectedData.forEach((x: any) => {
      items.forEach((y: any) => {
        if (Number(x.id) === y.id) thisData.push(y);
      });
    });

    if (!thisData.includes(child)) thisData = [child];

    let dragIcon: any = null;
    dragIcon = document.createElement("div");

    dragIcon.innerHTML = `
        <div class="dragIconTemplate">
          <p> ${thisData.length} </p>
          <span>${thisData.length > 1 ? "items" : "item"} </span>
        </div>
     `;

    dragIcon.width = "50";

    const div = document.createElement("div");
    div.appendChild(dragIcon);
    div.classList.add("TmpDragIcon");
    document.querySelector("body")!.appendChild(div);
    e.dataTransfer.setDragImage(dragIcon, 0, 0);

    const dataObj: any = {
      paths: thisData.map((x: any) => ({
        from: `${drive || ""}${x.path}`,
        fromType: child.type,
      })),
      from: location,
    };
    if (location === "remote") dataObj.sshData = sshData;
    e.dataTransfer.setData("path", JSON.stringify(dataObj));
  };

  const drop = (e: any, child: DataItem) => {
    const dragIcon = document.querySelector(".TmpDragIcon");
    dragIcon?.remove();

    e.preventDefault();
    let data = e.dataTransfer.getData("path"),
      copy = JSON.parse(data);
    copy.to = location;

    if (child.type === "directory")
      copy.paths.forEach((path: any) => {
        path.to = `${drive || ""}${child.path}`;
        path.toType = "directory";
      });
    else if (child.type === "file")
      copy.paths.forEach((path: any) => {
        path.to = `${drive || ""}${child.path
          .split("/")
          .slice(0, child.path.split("/").length - 1)
          .join("/")}`;
        path.toType = child.type;
      });

    axios({
      method: "POST",
      url: "http://localhost:3001/copyData",
      data: {
        sshData: sshData || copy.sshData,
        copyQuery: copy,
        currDirPath: { path: `${drive}${path}`, location },
      },
    }).then((res) => {
      if (res.data.err) return alert(res.data.data);
      if (res.data.data) {
        if (location === "local")
          setItems(_.parseLocalData(res.data.data.children));
        if (location === "remote")
          setItems(_.parseRemoteData(res.data.data[0].contents));
      }
    });
  };

  const dragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragEnd = () => {
    const dragIcon = document.querySelector(".TmpDragIcon");
    dragIcon?.remove();
  };
  return (
    <div
      style={{
        width: "50vw",
        marginRight: "20px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      className=".Page"
    >
      <div style={{ display: "flex" }}>
        <div
          onDrop={(e) =>
            drop(e, { name: "/", size: 0, path: "/", type: "directory", id: 0 })
          }
          onClick={() => setPath("/")}
          onDragOver={dragOver}
        >
          Root
        </div>
        {path.split("/").map((folder: any, i: number) => (
          <div
            onClick={() => {
              if (path.split("/").length - 1 === i) return;
              const thisPath = path.split("/"),
                idx = path.split("/").indexOf(folder);
              thisPath.length = idx + 1;
              setPath(thisPath.join("/"));
            }}
            key={i}
            onDragOver={dragOver}
            onDrop={(e) => {
              drop(e, {
                name: folder,
                size: 0,
                path: path
                  .split("/")
                  .slice(0, path.split("/").lastIndexOf(folder) + 1)
                  .join("/"),
                type: "directory",
                id: 0,
              });
            }}
          >
            {folder}

            {path.split("/").length - 1 !== i && "/"}
          </div>
        ))}
      </div>
      <div className={"Container"}>
        {items
          .sort(
            (a: any, b: any) => order.indexOf(a.type) - order.indexOf(b.type)
          )
          .map((child: any, i: number) => (
            <div
              id={`${child.id}`}
              className={"item"}
              onDragStart={(e) => dragStart(e, child)}
              draggable={true}
              onDragOver={dragOver}
              onDrop={(e) => drop(e, child)}
              onDoubleClick={() => update(child)}
              onDragEnd={dragEnd}
              key={i}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div className={"name"}>{child.name}</div>

              <div
                className={"rightDataItem"}
                style={{
                  flex: "1",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {filesize(child.size)}{" "}
                {child.type === "file"
                  ? mime.getType(child.name) || "file"
                  : "directory"}
              </div>
            </div>
          ))}

        <div
          onClick={clearSelected}
          className="ContainerPlaceHolder"
          onDragOver={dragOver}
          onDrop={(e) =>
            drop(e, {
              name: path.split("/")[path.split("/").length - 1],
              size: 0,
              path,
              type: "directory",
              id: 0,
            })
          }
        ></div>
      </div>
    </div>
  );
};
export default Files;
