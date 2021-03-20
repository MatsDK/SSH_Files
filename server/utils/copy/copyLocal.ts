import path from "path";
import fs from "fs-extra";
import { copyDataProps } from "../copyDataInterfaces";
import { findValidNewPath, findValidNewRemotePath } from "./findNewPaths";

export const copyLocal = async ({
  copyQuery,
  sshData,
  connect,
  sshConn,
  ssh,
}: copyDataProps) => {
  try {
    if (copyQuery.to === "remote") {
      await connect(sshData!.host, sshData!.username, sshData!.password);
      if (!sshConn.connection) return { err: true, data: "failed to connect" };

      for (let dataItem of copyQuery.paths) {
        let dataPathName: string = `${dataItem.to}/${
          dataItem.from.split("/")[dataItem.from.split("/").length - 1]
        }`;

        const newNameObj = await findValidNewRemotePath(
          dataPathName,
          dataItem.fromType === "directory" ? "dir" : "file",
          ssh
        );
        if (newNameObj.err) return { err: true, data: newNameObj.data };

        dataPathName = newNameObj.newName;

        if (dataItem.fromType === "directory") {
          const sshRes = await ssh
            .getSSHConn()
            .putDirectory(dataItem.from, dataPathName, {
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
            });

          if (sshRes.error) return { err: true, data: sshRes.data };
        } else {
          const sshRes = await ssh
            .getSSHConn()
            .putFile(dataItem.from, dataPathName);

          if (sshRes?.error) return { err: true, data: sshRes?.data };
        }
      }

      return { err: false };
    } else if (copyQuery.to === "local") {
      for (let dataItem of copyQuery.paths) {
        let dataPathName: string = `${dataItem.to}/${
          dataItem.from.split("/")[dataItem.from.split("/").length - 1]
        }`;

        dataPathName = findValidNewPath(
          dataPathName,
          dataItem.fromType === "directory" ? "dir" : "file"
        );

        fs.copySync(dataItem.from, dataPathName, {
          overwrite: false,
        });
      }

      return { err: false };
    }
  } catch (err) {
    return { err: true, data: err.message };
  }
};
