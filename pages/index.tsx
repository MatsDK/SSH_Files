import Layout from "../src/components/Layout";
import data from "../config.json";
import PresentContainer from "src/components/PresetContainer";

interface ConnectionPreset {
  id: string;
  name: string;
  hostIp: string;
  userName: string;
  port: number;
}

const Index = () => {
  return (
    <Layout>
      <>
        {data.connectionPresets.map((_: ConnectionPreset, idx: number) => (
          <PresentContainer preset={_} key={idx} />
        ))}
      </>
    </Layout>
  );
};

export default Index;
