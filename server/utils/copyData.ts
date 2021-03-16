import fs from "fs-extra";
import path from "path";

interface CopyDataPath {
  from: string;
  fromType: string;
  to: string;
  toType: string;
}

const copyData = async (
  copyQuery: any,
  sshData: any,
  connect: any,
  sshConn: any,
  ssh: any
) => {
  if (copyQuery.from === "remote") {
    if (copyQuery.to === "local") {
      await copyQuery.paths.forEach(async (dataItem: CopyDataPath) => {
        if (dataItem.fromType === "directory") {
          await connect(sshData!.host, sshData!.username, sshData!.password);

          if (!sshConn.connection)
            return { err: true, data: "failed to connect" };

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
                console.log(localPath, remotePath, error);
                if (error) return { err: true, data: error.message };
              },
            });
          return sshRes;
          // .then(() => {
          //   console.log("The File's contents were successfully downloaded");
          // })
          // .then((error: any) => {
          //   if (error) return { err: true, data: error.message };
          // });
        } else if (dataItem.fromType === "file") {
          console.log("get file", dataItem.from, dataItem.to + "/");
          return { err: false };
        }
      });
      return { err: false };
    }
  } else if (copyQuery.from === "local") {
    console.log("local");
  }
};

const findValidNewPath = (newPath: string, type: string): any => {
  if (type === "dir") {
    let isValid = false,
      newExtension = 0;

    while (!isValid) {
      if (fs.existsSync(newPath)) {
        console.log(path.extname(newPath));
        newPath = newPath + `(${newExtension})`;
      } else {
        isValid = true;
        return newPath;
      }
    }
  }
};

export default copyData;
