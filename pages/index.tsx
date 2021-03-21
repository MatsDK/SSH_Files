import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import _ from "../src/parseData";
import Container from "../src/components/Container";

interface indexProps {
  drives: object[];
  localData: { children: object[] };
}

const Index = (props: indexProps): JSX.Element => {
  return (
    <div style={{ display: "flex" }}>
      <Container
        tabs={[
          { name: "local1", location: "local" },
          { name: "local2", location: "local" },
        ]}
        data={props.localData}
        drives={props.drives}
        location="local"
      />
      <Container
        tabs={[
          { name: "remote1", location: "remote" },
          { name: "remote2", location: "remote" },
        ]}
        data={props.localData}
        drives={props.drives}
        location="local"
      />
    </div>
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

export default Index;
