import path from "path";
import fs from "fs-extra";

interface RemoteReturnObj {
  changed?: boolean;
  newName: string;
  err?: boolean;
  data?: string;
}

export const findValidNewRemotePath = async (
  newPath: string,
  type: string,
  ssh: any
): Promise<RemoteReturnObj> => {
  let isValid: boolean = false,
    newExtension: number = 0;

  if (type === "dir") {
    const remotePathExists = await checkIfRemotePathExists(newPath, ssh);

    if (remotePathExists.err)
      return { err: true, data: remotePathExists.data, newName: newPath };
    if (!remotePathExists.exists) return { changed: false, newName: newPath };

    while (!isValid) {
      const currentPath: string = newPath + `${newExtension}`,
        remotePathExists = await checkIfRemotePathExists(currentPath, ssh);

      if (remotePathExists.err)
        return { err: true, data: remotePathExists.data, newName: newPath };

      if (remotePathExists.exists) newExtension++;
      else {
        isValid = true;
        return { changed: true, newName: currentPath };
      }
    }
  } else if (type === "file") {
    const remotePathExists = await checkIfRemotePathExists(newPath, ssh);

    if (remotePathExists.err)
      return { err: true, data: remotePathExists.data, newName: newPath };
    if (!remotePathExists.exists) return { changed: false, newName: newPath };

    const ext = path.extname(newPath),
      pathWithoutExt = newPath.slice(0, newPath.lastIndexOf(ext));

    while (!isValid) {
      const currentPath: string = pathWithoutExt + `${newExtension}` + ext,
        remotePathExists = await checkIfRemotePathExists(currentPath, ssh);

      if (remotePathExists.err)
        return { err: true, data: remotePathExists.data, newName: newPath };

      if (remotePathExists.exists) newExtension++;
      else {
        isValid = true;
        return { changed: true, newName: currentPath };
      }
    }
  }

  return { err: false, newName: newPath };
};

export const findValidNewPath = (newPath: string, type: string): string => {
  let isValid: boolean = false,
    newExtension: number = 0;

  if (!fs.existsSync(newPath)) return newPath;
  if (type === "dir") {
    while (!isValid) {
      const currentPath: string = newPath + `${newExtension}`;

      if (fs.existsSync(currentPath)) newExtension++;
      else {
        isValid = true;
        return currentPath;
      }
    }
  } else if (type === "file") {
    const ext = path.extname(newPath),
      pathWithoutExt = newPath.replace(new RegExp(ext, "m"), "");

    while (!isValid) {
      let currentPath: string = pathWithoutExt + `${newExtension}` + ext;

      if (fs.existsSync(currentPath)) newExtension++;
      else {
        isValid = true;
        return currentPath;
      }
    }
  }
  return newPath;
};

const checkIfRemotePathExists = async (path: string, ssh: any) => {
  const existsSshRes = await ssh
    .getSSHConn()
    .execCommand(
      `test -f "${path}" && echo "1" || echo "0" &&  test -d "${path}" && echo "1" || echo "0"`,
      {
        cwd: "/",
      }
    );
  if (existsSshRes.stderr)
    return { exists: false, err: true, data: existsSshRes.stderr };

  return {
    exists:
      existsSshRes.stdout.split`\n`
        .map((x: string) => +x)
        .reduce((a: number, b: number) => a + b, 0) > 0,
  };
};
