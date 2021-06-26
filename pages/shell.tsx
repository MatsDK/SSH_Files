import Terminal from "../src/components/Terminal";
import { SocketContext, socket } from "../src/context/socket";
import Layout from "src/components/Layout";

const shell = () => {
  return (
    <Layout>
      <div className="shellContainer">
        <SocketContext.Provider value={socket}>
          <Terminal />
        </SocketContext.Provider>
      </div>
    </Layout>
  );
};

export default shell;
