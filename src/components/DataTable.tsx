import filesize from "filesize";
import mime from "mime";
const order = ["directory", "file"];

interface DataTableProps {
  items: any[];
  dragStart: any;
  dragOver: any;
  drop: any;
  update: any;
  dragEnd: any;
}

const DataTable = ({ items, ...funcs }: DataTableProps) => {
  return (
    <div>
      {items
        .sort((a: any, b: any) => order.indexOf(a.type) - order.indexOf(b.type))
        .map((child: any, i: number) => (
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
    </div>
  );
};

export default DataTable;
