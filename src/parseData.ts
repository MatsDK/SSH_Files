const parseRemoteData = (remoteData: any[]) => {
  let arr: any[] = [];
  if (!remoteData) return [];
  remoteData.forEach((child: any) => {
    if (child.type === "link" || child.error) return;
    let newObject: any = {
      name: child.name.split("/")[child.name.split("/").length - 1],
      path: child?.name?.replace(".", ""),
      type: child.type,
      size: child.size,
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

  localData.forEach((child: any) => {
    if (child.type === "link" || child.error) return;
    let newObject: any = {
      name: child.name,
      path: child.path.split(":").slice(1).join(""),
      type: child.type,
      size: child.sizeInBytes,
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
