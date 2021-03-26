import filesize from "filesize";
import mime from "mime";
import { ArrowForwardIos } from "@material-ui/icons";
import { useEffect, useState } from "react";

interface DataTableProps {
  path: string;
  items: any[];
  dragStart: any;
  dragOver: any;
  drop: any;
  update: any;
  dragEnd: any;
  clearSelected: any;
}

const SortArrow = ({ dir }) => {
  if (!dir) return <></>;

  if (dir === "desc")
    return (
      <div className="HeadingArrow HeadingArrowDown">
        <ArrowForwardIos style={{ height: "20px", width: "20px" }} />
      </div>
    );
  else
    return (
      <div className="HeadingArrow HeadingArrowUp">
        <ArrowForwardIos style={{ height: "20px", width: "20px" }} />
      </div>
    );
};

const orderDataBy = (data: any, value: any, dir: any) => {
  if (value === "type") {
    let order: string[];
    if (dir === "asc") {
      order = ["directory", "file"];
      return data.sort(
        (a: any, b: any) => order.indexOf(a.type) - order.indexOf(b.type)
      );
    }
    if (dir === "desc") {
      order = ["file", "directory"];
      return data.sort(
        (a: any, b: any) => order.indexOf(a.type) - order.indexOf(b.type)
      );
    }
  }

  if (dir === "asc")
    return data.sort((a: any, b: any) => (a[value] > b[value] ? 1 : -1));
  if (dir === "desc")
    return data.sort((a: any, b: any) => (a[value] > b[value] ? -1 : 1));

  return data;
};

const DataTable = ({ items, path, ...funcs }: DataTableProps) => {
  const [data, setData] = useState<any[]>();
  const [dir, setDir] = useState<string>("asc");
  const [value, setValue] = useState<string>("type");

  useEffect(() => {
    setData(orderDataBy(items, value, dir));
    funcs.clearSelected();
  }, [items, value, dir]);

  const switchDir = () => {
    if (!dir) setDir("desc");
    else if (dir === "desc") setDir("asc");
    else setDir("");
  };

  const setValueAndDir = (value: any): void => {
    switchDir();
    setValue(value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div className="dataTableHeading">
        <button
          onClick={() => setValueAndDir("name")}
          className="HeadingButton NameHeadingButton"
        >
          name {value === "name" ? <SortArrow dir={dir} /> : ""}
        </button>
        <button
          className="HeadingButton"
          onClick={() => setValueAndDir("size")}
        >
          size {value === "size" ? <SortArrow dir={dir} /> : ""}
        </button>
        <button
          className="HeadingButton"
          onClick={() => setValueAndDir("type")}
        >
          type {value === "type" ? <SortArrow dir={dir} /> : ""}
        </button>
      </div>
      <div className="dataScrollContainer">
        {data &&
          data.map((child: any, i: number) => (
            <div
              id={`${child.id}`}
              className={"item"}
              onDragStart={(e) => funcs.dragStart(e, child)}
              draggable={true}
              onDragOver={(e) => funcs.dragOver(e, child)}
              onDrop={(e) => funcs.drop(e, child)}
              onDoubleClick={() => funcs.update(child)}
              onDragEnd={funcs.dragEnd}
              key={i}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div className={"name"}>{child.name}</div>

              <span>{filesize(child.size)} </span>
              <span>
                {child.type === "file"
                  ? mime.getType(child.name) || "File"
                  : "Folder"}
              </span>
            </div>
          ))}
        <div
          onClick={funcs.clearSelected}
          className="ContainerPlaceHolder"
          onDragOver={(e) => funcs.dragOver(e, path)}
          onDrop={(e) =>
            funcs.drop(e, {
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

export default DataTable;
