import { NodeSSH } from "node-ssh";

const ssh: NodeSSH = new NodeSSH();

let sshConn: any = { connection: false };

const connect = async (
  host: string,
  username: string,
  password: string,
  port: number
) => {
  const sshClient = await ssh.connect({
    port,
    host,
    username,
    password,
  });
  sshConn = sshClient;
  return { connection: true };
};

const timeout = (cb: any, interval: number) => () =>
  new Promise((resolve) => setTimeout(() => cb(resolve), interval));

const onTimeout = timeout(
  (resolve: any) => resolve({ connection: false }),
  3000
);

export default {
  connect: (host: any, username: any, password: any, port: number) =>
    Promise.race(
      [connect, onTimeout].map((f) => f(host, username, password, port))
    ).then((res) => {
      return res;
    }),
  getSSHConn: () => {
    return sshConn;
  },
  execCommand: (text: string, params: any) => sshConn.execCommand(text, params),
  sshConn,
};
