import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import _ from "../src/parseData";
import Container from "../src/components/Container";
import Layout from "src/components/Layout";

interface indexProps {
  drives: object[];
  localData: { children: object[] };
}

const Files = (props: indexProps): JSX.Element => {
  return (
    <Layout>
      <div className="MainPage">
        <div className="SideContainer">
          <Container
            tabs={[{ name: "local", location: "local" }]}
            data={props.localData}
            drives={props.drives}
            location="local"
          />
        </div>
        <pre className="ContainersMiddle"></pre>
        <div className="SideContainer">
          <Container
            tabs={[{ name: "remote", location: "remote" }]}
            data={props.localData}
            drives={props.drives}
            location="local"
          />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
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
