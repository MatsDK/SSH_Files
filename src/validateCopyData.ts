interface moveToPath {
  from: string;
  fromType: string;
  to: string;
  toType: string;
}

interface validatecopyDataDataProps {
  from: string;
  to: string;
  paths: moveToPath[];
}

const validatecopyDataData = (
  copyData: validatecopyDataDataProps,
  drive: string
) => {
  copyData.paths.filter(
    (path: moveToPath) =>
      path.fromType === "file" || path.fromType === "directory"
  );

  if (copyData.from === "local") {
    if (copyData.to === "local") {
      for (let path of copyData.paths) {
        if (
          path.toType === "directory" &&
          path.fromType === "directory" &&
          path.to === path.from
        )
          return { err: "can't move inside itself" };

        const fromPath: string = path.from
          .split("/")
          .slice(0, path.from.split("/").length - 1)
          .join("/");

        if (checkLocalPaths(path.to, fromPath, path))
          return { err: "can't move to the same folder" };
      }
    } else if (copyData.to === "remore") {
      console.log("download to remote");
    }
  } else if (copyData.from === "remote") {
    console.log("download from remote");
  }

  copyData.paths.forEach((x: moveToPath) => {
    if (x.toType === "file")
      if (x.to.split("/")[0] === drive && x.to.split(":").length === 2)
        x.to = drive + "/";
      else
        x.to = x.to
          .split("/")
          .slice(0, x.to.split("/").length - 1)
          .join("/");

    x.toType = "directory";
  });

  return copyData;
};

const checkLocalPaths = (
  toPath: string,
  fromPath: string,
  path: moveToPath
) => {
  return (
    (path.toType === "file" &&
      path.fromType === "file" &&
      toPath === fromPath) ||
    (toPath === fromPath &&
      path.fromType === "directory" &&
      path.toType === "file") ||
    (path.fromType === "file" &&
      path.toType === "directory" &&
      toPath === fromPath &&
      path.to === fromPath) ||
    (fromPath === path.to &&
      path.fromType === "directory" &&
      path.toType === "directory") ||
    path.from === toPath ||
    (fromPath === path.to &&
      path.fromType === "file" &&
      path.toType !== "directory")
  );
};

export default { validatecopyDataData };
