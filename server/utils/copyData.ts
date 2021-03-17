import fs from "fs-extra";
import path from "path";

// interface CopyDataPath {
//   from: string;
//   fromType: string;
//   to: string;
//   toType: string;
// }

const copyData = async (
  copyQuery: any,
  sshData: any,
  connect: any,
  sshConn: any,
  ssh: any
) => {
  if (copyQuery.from === "remote") {
    if (copyQuery.to === "local") {
      for (let dataItem of copyQuery.paths) {
        await connect(sshData!.host, sshData!.username, sshData!.password);
        if (!sshConn.connection)
          return { err: true, data: "failed to connect" };

        if (dataItem.fromType === "directory") {
          let dataPathName: string =
            dataItem.to + "/" + dataItem.from.split("/").pop();

          dataPathName = findValidNewPath(dataPathName, "dir");
          fs.mkdirSync(dataPathName);

          const sshRes = await ssh
            .getSSHConn()
            .getDirectory(dataPathName, dataItem.from, {
              recursive: true,
              concurrency: 20,
              validate: (itemPath: string) => {
                const baseName = path.basename(itemPath);
                return (
                  baseName.substr(0, 1) !== "." && baseName !== "node_modules"
                );
              },
              tick: (localPath: string, remotePath: string, error: any) => {
                if (error) return { err: true, data: error.message };
              },
            })
            .then(() => {
              return { err: false };
            });

          if (sshRes.error) return { err: true, data: sshRes.data };
        } else if (dataItem.fromType === "file") {
          let dataPathName: string =
            dataItem.to + "/" + dataItem.from.split("/").pop();

          dataPathName = findValidNewPath(dataPathName, "file");

          const sshRes = await ssh
            .getSSHConn()
            .getFile(dataPathName, dataItem.from)
            .then(
              (Contents: any) => {
                console.log("Done", Contents);
                return { err: false };
              },
              (error: any) => {
                if (error) return { err: error.message };
              }
            );

          if (sshRes.err) return { err: sshRes.err };
        }
      }
      return { err: false };
    }
  } else if (copyQuery.from === "local") {
    console.log("local");
  }
};

const findValidNewPath = (newPath: string, type: string): string => {
  let isValid = false,
    newExtension = 0;

  if (type === "dir") {
    while (!isValid) {
      if (fs.existsSync(newPath)) {
        newPath = newPath + `(${newExtension})`;
        newExtension++;
      } else {
        isValid = true;
        return newPath;
      }
    }
  } else if (type === "file") {
    if (!fs.existsSync(newPath)) return newPath;

    const ext = path.extname(newPath);
    let pathWithoutExt = newPath.replace(new RegExp(ext, "m"), "");

    while (!isValid) {
      let currentPath: string = pathWithoutExt + `(${newExtension})` + ext;
      if (fs.existsSync(currentPath)) newExtension++;
      else {
        isValid = true;
        return currentPath;
      }
    }
  }
  return newPath;
};

export default copyData;
