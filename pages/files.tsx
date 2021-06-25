import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Layout from "src/components/Layout";
import Container from "../src/components/Container";
import _ from "../src/parseData";

interface indexProps {
  drives: object[];
  localData: { children: object[] };
}

interface queryProps {
  host: string | null;
  userName: string | null;
  port: number | null;
}

const Files: React.FC<indexProps> = ({ drives, localData }) => {
  const router = useRouter();
  const sshConnectionData: queryProps = {
    host: (router.query.h as string) || null,
    port: (Number(router.query.p) as number) || null,
    userName: (router.query.u as string) || null,
  };

  return (
    <Layout>
      <div className="MainPage">
        <div className="SideContainer">
          <Container
            tabs={[{ name: "local", location: "local" }]}
            data={localData}
            drives={drives}
          />
        </div>
        <pre className="ContainersMiddle"></pre>
        <div className="SideContainer">
          <Container
            tabs={
              Object.values(sshConnectionData).filter((_) => !!_).length
                ? [{ name: "remote", location: "remote", sshConnectionData }]
                : []
            }
            data={localData}
            drives={drives}
          />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await axios({
    method: "GET",
    url: "http://localhost:3001/data",
  });

  const parsedLocalData = _.parseLocalData(data.data.localData.children);
  return {
    props: {
      drives: data.data.drives,
      localData: { children: parsedLocalData },
    },
  };
};

export default Files;
