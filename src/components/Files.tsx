import filesize from "filesize";
import validate from "src/validateCopyData";
const order = ["directory", "file"];

const Files = ({ data, update, loc: { path, location, sshData }, drive }) => {
  const dragStart = (e, child) => {
    // const target = e.target
    const dataObj = {
      from: location,
      paths: [{ from: `${drive || ""}${child.path}`, fromType: child.type }],
    };
    e.dataTransfer.setData("path", JSON.stringify(dataObj));
  };

  const drop = (e, child) => {
    e.preventDefault();

    const data = e.dataTransfer.getData("path"),
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
          .slice(0, path.from.split("/").length - 1)
          .join("/")}`;
        path.toType = child.type;
      });

    const isValid: any = validate.validatecopyDataData(copy, drive);
    if (isValid.err) return alert(isValid.err);

    console.log(isValid);
  };

  const dragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragLeave = (e) => {};

  return (
    <div>
      {data
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
          >
            {child.name} {filesize(child.size)}
          </div>
        ))}
    </div>
  );
};
export default Files;
