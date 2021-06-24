import { NodeSSH } from "node-ssh";

const ssh: NodeSSH = new NodeSSH();

let sshConn: NodeSSH | { connection: boolean } = { connection: false };

const connect = async (
  host: string,
  username: string,
  password: string,
  port: number
) => {
  const sshClient: NodeSSH = await ssh.connect({
    port,
    host,
    username,
    password,
  });
  sshConn = sshClient;
  return { connection: true };
};

const timeout =
  (cb: any, interval: number): any =>
  (): Promise<any> =>
    new Promise((resolve) => setTimeout(() => cb(resolve), interval));

type x = ({ connection: boolean }) => any;
const onTimeout: Promise<{ connection: boolean }> = timeout(
  (resolve: x) => resolve({ connection: false }),
  3000
);

export default {
  connect: (
    host: any,
    username: any,
    password: any,
    port: number
  ): Promise<{ connection: any }> =>
    Promise.race(
      [connect, onTimeout].map((f: any) => f(host, username, password, port))
    ).then((res) => {
      return res;
    }),
  getSSHConn: () => {
    return sshConn;
  },
  execCommand: (text: string, params: any) =>
    (sshConn as NodeSSH).execCommand(text, params),
  sshConn,
};
