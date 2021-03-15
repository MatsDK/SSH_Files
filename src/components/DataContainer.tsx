import axios from "axios";
import { useEffect, useState } from "react";
import _ from "../parseData";
import Files from "./Files";

interface dataContainerProps {
  data: { children: object[] };
  location: string;
  sshData?: object;
  drives?: any[];
}

const DataContainer = (props: dataContainerProps) => {
  const [path, setPath] = useState<string>("/");
  const [loading, setLoading] = useState<boolean>(false);
  const [pathChanged, setPathChanged] = useState<boolean>(false);
  const [activeDrive, setActiveDrive] = useState<any | undefined>(
    props.drives?.[0]._mounted || ""
  );
  const [data, setData] = useState<object[]>([]);

  useEffect(() => {
    setData(props.data.children);
  }, [props.data.children]);

  useEffect(() => {
    if (
      path === "/" &&
      props.drives &&
      activeDrive === props.drives?.[0]._mounted
    )
      return setData(props.data.children);

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
      setActiveDrive(props.drives?.[0]._mounted || "");
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
    <div>
      <div style={{ display: "flex" }}>
        {props.drives && (
          <div>
            <select onChange={(e) => setActiveDrive(e.target.value)}>
              {props.drives.map((x: any, i: number) => (
                <option key={i} value={x._mounted}>
                  {x._mounted}
                </option>
              ))}
            </select>
          </div>
        )}
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
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Files
          data={data}
          loc={{ path, location: props.location, sshData: props.sshData }}
          drive={activeDrive}
          update={updatePath}
        />
      )}
    </div>
  );
};

export default DataContainer;
