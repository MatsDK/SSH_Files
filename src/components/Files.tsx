import axios from "axios";
import { useEffect, useState } from "react";
import _ from "../parseData";
import DataTable from "./DataTable";
import { ArrowRight } from "@material-ui/icons";

interface DataItem {
  name: string;
  path: string;
  type: string;
  size: number;
  id: number;
  children?: any[];
}

interface FilesProps {
  selected: {
    selectedData: any[];
    setSelectedData: any;
    selection: any;
    clearSelected: any;
  };
  data: object[];
  update: any;
  loc: any;
  drive: string;
  loading: boolean;
}

const Files = ({
  data,
  update,
  loc: { path, location, sshData, setPath },
  drive,
  selected: { selectedData, clearSelected },
  loading,
}: FilesProps) => {
  const [items, setItems] = useState<object[]>(data);

  useEffect(() => {
    setItems(data);
  }, [data]);

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
    e.target.classList.remove("dragOverPath");

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

  const dragOver = (e: any, child) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragEnd = () => {
    const dragIcon = document.querySelector(".TmpDragIcon");
    dragIcon?.remove();
  };

  const dragEnterPath = (e, child) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.add("dragOverPath");
  };

  const dragLeavePath = (e) => {
    e.target.classList.remove("dragOverPath");
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
      <div className="PathWrapper" style={{ display: "flex" }}>
        <div
          className={path === "/" ? "CurrPathName" : "PathName"}
          onDrop={(e) =>
            drop(e, { name: "/", size: 0, path: "/", type: "directory", id: 0 })
          }
          onClick={() => setPath("/")}
          onDragOver={(e) => dragEnterPath(e, "root")}
          onDragLeave={dragLeavePath}
        >
          Root
        </div>
        {path.split("/").map((folder: any, i: number) => (
          <div key={i} style={{ display: "flex" }}>
            <span
              className={
                path.split("/").length - 1 === i
                  ? "CurrentPathName"
                  : "PathName"
              }
              onClick={() => {
                if (path.split("/").length - 1 === i) return;
                const thisPath = path.split("/"),
                  idx = path.split("/").indexOf(folder);
                thisPath.length = idx + 1;
                setPath(thisPath.join("/"));
              }}
              onDragOver={(e) => dragEnterPath(e, folder)}
              onDragLeave={dragLeavePath}
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
            </span>
            <div className="PathArrow">
              {path.split("/").length - 1 !== i &&
                !!path.split("/")[1] &&
                path.split("/").length >= 2 && <ArrowRight />}
            </div>
          </div>
        ))}
      </div>
      <div className={"Container"}>
        <DataTable
          items={items}
          loading={loading}
          update={update}
          clearSelected={clearSelected}
          dragStart={dragStart}
          dragOver={dragOver}
          drop={drop}
          dragEnd={dragEnd}
          path={path}
        />
      </div>
    </div>
  );
};
export default Files;
