import Layout from "src/components/Layout";
import data from "../config.json";

interface ConnectionPreset {
  id: string;
  name: string;
  hostIp: string;
  userName: string;
}
const Index = () => {
  return (
    <Layout>
      <>
        {data.connectionPresets.map((_: ConnectionPreset, idx: number) => {
          return (
            <div key={idx}>
              <p>{_.name}</p>
              <p>{_.hostIp}</p>
              <p>{_.userName}</p>
            </div>
          );
        })}
      </>
    </Layout>
  );
};

export default Index;
