import express, { Request, Response } from "express";
import ssh from "./utils/ssh";
const dree = require("dree");
const nodeDiskInfo = require("node-disk-info");

const router = express.Router();
let sshConn = ssh.sshConn;

const connect = async (host: string, username: string, password: string) => {
  try {
    if (sshConn.connection) return ssh;
    sshConn = await ssh.connect(host, username, password);
    if (sshConn.connection) return ssh;
  } catch (err) {
    console.log(err);
  }
};

const options = {
  stat: true,
  normalize: true,
  followLinks: false,
  size: true,
  hash: false,
  depth: 2,
};

router.get("/data", async (req: Request, res: Response) => {
  const disks = await nodeDiskInfo.getDiskInfo();

  const fileTree = dree.scan(`${disks[0]._mounted}/`, options);
  res.json({ localData: fileTree, drives: disks });
});

interface sshConnectionProps {
  host: string;
  username: string;
  password: string;
}

interface getDataBody {
  location: string;
  path: string;
  sshData: sshConnectionProps | undefined;
}

router.post("/data", async (req: Request, res: Response) => {
  const { location, path, sshData }: getDataBody = req.body;
  let fileTree: any;

  if (location === "local") {
    fileTree = dree.scan(path, options);
  } else if (location === "remote") {
    await connect(sshData!.host, sshData!.username, sshData!.password);
    if (!sshConn.connection)
      return res.json({ err: true, data: "failed to connect" });

    const sshRes = await ssh.execCommand(`tree -J -L 2 -f -s ${path} `, {
      cwd: "/",
    });
    if (sshRes.stderr) throw sshRes.stderr;
    fileTree = JSON.parse(sshRes.stdout);
  }

  res.json({ data: fileTree });
});

interface ConnectSSHBody {
  host: string;
  password: string;
  username: string;
}

router.post("/connectSSH", async (req: Request, res: Response) => {
  const { host, password, username }: ConnectSSHBody = req.body;

  if (!host || !password || !username)
    return res.json({
      connected: false,
      err: true,
      data: "invalid connection data",
    });

  await connect(host, username, password);

  if (!sshConn.connection)
    return res.json({
      connected: false,
      err: true,
      data: `can't connect to ${host} as ${username}`,
    });

  const sshRes = await ssh.execCommand(`tree -J -L 2 -f -s `, {
    cwd: "/",
  });
  if (sshRes.stderr)
    res.json({ connect: false, err: true, data: sshRes.stderr });

  res.json({ connected: true, err: false, data: sshRes.stdout });
});

export default router;
