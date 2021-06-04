import { copyFromRemote } from "./copy/copyFromSsh";
import { copyLocal } from "./copy/copyLocal";
import { copyDataProps } from "./copyDataInterfaces";
const dree = require("dree");

const options = {
  stat: true,
  normalize: true,
  followLinks: false,
  size: true,
  hash: false,
  depth: 2,
};

export const copyData = async ({
  copyQuery,
  sshData,
  connect,
  sshConn,
  ssh,
  currDirPath,
}: copyDataProps) => {
  try {
    let copyRes: any, fileTree: any;
    if (copyQuery.from === "remote") {
      const props: copyDataProps = {
        copyQuery,
        sshData,
        connect,
        sshConn,
        ssh,
        currDirPath,
      };
      copyRes = await copyFromRemote(props);
    } else if (copyQuery.from === "local") {
      const props: copyDataProps = {
        copyQuery,
        sshData,
        connect,
        sshConn,
        ssh,
        currDirPath,
      };
      copyRes = await copyLocal(props);
    }

    if (copyRes?.err) return { err: true, data: copyRes.data };
    if (currDirPath.location === "local")
      fileTree = dree.scan(currDirPath.path, options);
    else if (currDirPath.location === "remote") {
      const tree = await ssh.execCommand(
        `tree -J -L 2 -f -s ${currDirPath.path} `,
        {
          cwd: "/",
        }
      );
      fileTree = JSON.parse(tree.stdout);
    }

    return { ...copyRes, data: fileTree };
  } catch (err) {
    console.log(err);
    return { err: true, data: err.message };
  }
};
