import { copyFromRemote } from "./copy/copyFromSsh";
import { copyLocal } from "./copy/copyLocal";
import { copyDataProps } from "./copyDataInterfaces";

export const copyData = async ({
  copyQuery,
  sshData,
  connect,
  sshConn,
  ssh,
}: copyDataProps) => {
  if (copyQuery.from === "remote") {
    const props: copyDataProps = {
      copyQuery,
      sshData,
      connect,
      sshConn,
      ssh,
    };
    return await copyFromRemote(props);
  } else if (copyQuery.from === "local") {
    const props: copyDataProps = {
      copyQuery,
      sshData,
      connect,
      sshConn,
      ssh,
    };
    return await copyLocal(props);
  }
};
