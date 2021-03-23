import fs from "fs-extra";
import path from "path";
import { findValidNewPath, findValidNewRemotePath } from "./findNewPaths";
import { copyDataProps } from "../copyDataInterfaces";

export const copyFromRemote = async ({
  copyQuery,
  sshData,
  connect,
  sshConn,
  ssh,
}: copyDataProps) => {
  if (copyQuery.to === "local") {
    await connect(sshData!.host, sshData!.username, sshData!.password);
    if (!sshConn.connection) return { err: true, data: "failed to connect" };

    for (let dataItem of copyQuery.paths) {
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
          });

        if (sshRes.error) return { err: true, data: sshRes.data };
      } else if (dataItem.fromType === "file") {
        let dataPathName: string =
          dataItem.to + "/" + dataItem.from.split("/").pop();

        dataPathName = findValidNewPath(dataPathName, "file");

        const sshRes = await ssh
          .getSSHConn()
          .getFile(dataPathName, dataItem.from);

        if (sshRes?.err) return { err: sshRes.err };
      }
    }
    return { err: false };
  } else if (copyQuery.to === "remote") {
    await connect(sshData!.host, sshData!.username, sshData!.password);
    if (!sshConn.connection) return { err: true, data: "failed to connect" };

    for (let dataItem of copyQuery.paths) {
      if (dataItem.fromType === "directory") {
        let dataItemName: string =
          dataItem.to + "/" + dataItem.from.split("/").pop();

        let copyCommand = `cp -a ${dataItem.from} ${dataItem.to}`;

        const newNameObj: any = await findValidNewRemotePath(
          dataItemName,
          "dir",
          ssh
        );

        if (newNameObj.err) return { err: true, data: newNameObj.data };
        else if (newNameObj.changed) {
          dataItemName = newNameObj.newName;
          copyCommand = `cp -a ${dataItem.from}/* ${newNameObj.newName}`;

          const sshMkdirSshRes = await ssh
            .getSSHConn()
            .execCommand(`mkdir ${newNameObj.newName}`, {
              cwd: "/",
            });

          if (sshMkdirSshRes.stderr)
            return { err: true, data: sshMkdirSshRes.stderr };
        }

        const copySshRes = await ssh.getSSHConn().execCommand(copyCommand, {
          cwd: "/",
        });

        if (copySshRes.stderr) return { err: true, data: copySshRes.stderr };
      } else if (dataItem.fromType === "file") {
        let newDataPathName: string =
          dataItem.to + "/" + dataItem.from.split("/").pop();

        let copyCommand = `cp -a ${dataItem.from} ${dataItem.to}`;

        const newNameObj: any = await findValidNewRemotePath(
          newDataPathName,
          "file",
          ssh
        );

        if (newNameObj.err) return { err: true, data: newNameObj.data };
        else if (newNameObj.changed) {
          newDataPathName = newNameObj.newName;
          copyCommand = `cp ${dataItem.from} ${newNameObj.newName}`;
        }

        const copySshRes = await ssh
          .getSSHConn()
          .execCommand(copyCommand, { cwd: "/" });

        if (copySshRes.stderr) return { err: true, data: copySshRes.stderr };
      }
    }
    return { err: false };
  }
};
