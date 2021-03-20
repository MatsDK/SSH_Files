import axios from "axios";
import filesize from "filesize";
import mime from "mime";
import { useEffect, useState } from "react";
import _ from "../parseData";

const order = ["directory", "file"];

interface DateItem {
  name: string;
  path: string;
  type: string;
  size: number;
  children?: any[];
}

const Files = ({ data, update, loc: { path, location, sshData }, drive }) => {
  const [items, setItems] = useState<DateItem[]>(data);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const dragStart = (e: any, child: DateItem) => {
    const dataObj: any = {
      from: location,
      paths: [{ from: `${drive || ""}${child.path}`, fromType: child.type }],
    };
    if (location === "remote") dataObj.sshData = sshData;
    e.dataTransfer.setData("path", JSON.stringify(dataObj));
  };

  const drop = (e: any, child: DateItem) => {
    e.preventDefault();
    let data = e.dataTransfer.getData("path"),
      copy = JSON.parse(data);
    copy.to = location;

    if (child.type === "directory")
      copy.paths.forEach((path: any) => {
        path.to = `${drive || ""}${child.path}`;
        path.toType = "directory";
      });
    else if (child.type === "file") {
      copy.paths.forEach((path: any) => {
        path.to = `${drive || ""}${child.path
          .split("/")
          .slice(0, child.path.split("/").length - 1)
          .join("/")}`;
        path.toType = child.type;
      });
    }

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

  const dragLeave = (e: any) => {};

  return (
    <div style={{ width: "45vw", marginRight: "20px" }}>
      {items
        .sort((a: any, b: any) => order.indexOf(a.type) - order.indexOf(b.type))
        .map((child: any, i: number) => (
          <div
            onDragStart={(e) => dragStart(e, child)}
            draggable={true}
            onDragLeave={dragLeave}
            onDragOver={dragOver}
            onDrop={(e) => drop(e, child)}
            onDoubleClick={() => update(child)}
            key={i}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {child.name}
            <div>
              {filesize(child.size)}{" "}
              {child.type === "file"
                ? mime.getType(child.name) || "file"
                : "directory"}
            </div>
          </div>
        ))}
    </div>
  );
};
export default Files;
