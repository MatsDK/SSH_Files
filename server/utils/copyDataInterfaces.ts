interface dataPath {
  from: string;
  to: string;
  fromType: string;
  toType: string;
}

interface copyQueryType {
  from: string;
  fromType: string;
  to: string;
  toType: string;
  paths: dataPath[];
}

export interface currDirPathProp {
  location: string;
  path: string;
}

export interface copyDataProps {
  sshData: any;
  connect: any;
  sshConn: any;
  copyQuery: copyQueryType;
  ssh: any;
  currDirPath: currDirPathProp;
}
