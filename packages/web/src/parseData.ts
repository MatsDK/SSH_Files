const parseRemoteData = (remoteData: any[]) => {
  let arr: any[] = [];
  if (!remoteData) return [];
  remoteData.forEach((child: any, i: number) => {
    if (child.type === "link" || child.error) return;

    let newName = child.name;
    if (child.name.charAt(0) === ".") newName = newName.replace(".", "");

    let newObject: any = {
      name: child.name.split("/")[child.name.split("/").length - 1],
      path: newName,
      type: child.type,
      size: child.size,
      id: i,
    };

    if (child.type === "directory")
      newObject.children = parseRemoteData(child.contents);

    arr.push(newObject);
  });
  return arr;
};

const parseLocalData = (localData: any[]) => {
  let arr: any[] = [];
  if (!localData) return [];

  localData.forEach((child: any, i: number) => {
    if (child.type === "link" || child.error) return;
    let newObject: any = {
      name: child.name,
      path: child.path.split(":").slice(1).join(""),
      type: child.type,
      size: child.sizeInBytes,
      id: i,
    };

    if (child.type === "directory")
      newObject.children = parseLocalData(
        "children" in child ? child.children : []
      );

    arr.push(newObject);
  });

  return arr;
};

const _ = {
  parseRemoteData,
  parseLocalData,
};

export default _;
