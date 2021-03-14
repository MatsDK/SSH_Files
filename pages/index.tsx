import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import DataContainer from "../src/components/DataContainer";
import SshConnect from "../src/components/SshConnect";
import _ from "../src/parseData";

interface indexProps {
  localData: { children: object[] };
}

const Index = (props: indexProps): JSX.Element => {
  return (
    <div style={{ display: "flex" }}>
      {/* <DataContainer data={props.remoteData} location="remote" /> */}
      <DataContainer data={props.localData} location="local" />
      <SshConnect />
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
      localData: { children: parsedLocalData },
    },
  };
};

export default Index;
