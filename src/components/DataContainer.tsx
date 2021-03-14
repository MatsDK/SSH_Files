import axios from "axios";
import { useEffect, useState } from "react";
import _ from "../parseData";
import filesize from "filesize";

interface dataContainerProps {
  data: { children: object[] };
  location: string;
  sshData?: object;
}

const order = ["directory", "file"];

const DataContainer = (props: dataContainerProps) => {
  const [path, setPath] = useState<string>("/");
  const [data, setData] = useState<object[]>([]);

  useEffect(() => {
    setData(props.data.children);
  }, [props.data.children]);

  useEffect(() => {
    if (path === "/") return setData(props.data.children);
    axios({
      method: "POST",
      url: "http://localhost:3001/data",
      data: {
        path,
        location: props.location,
        sshData: props.sshData || undefined,
      },
    }).then((res) => {
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

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div onClick={() => setPath("/")}>Root</div>
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
          >
            {folder}
          </div>
        ))}
      </div>
      {data
        .sort((a: any, b: any) => order.indexOf(a.type) - order.indexOf(b.type))
        .map((child: any, i: number) => (
          <div onDoubleClick={() => updatePath(child)} key={i}>
            {child.name} {filesize(child.size)}
          </div>
        ))}
    </div>
  );
};

export default DataContainer;
