import Terminal from "../src/components/Terminal";
import { SocketContext, socket } from "../src/context/socket";

const shell = () => {
  return (
    <>
      <div className="shellContainer">
        <SocketContext.Provider value={socket}>
          <Terminal />
        </SocketContext.Provider>
      </div>
    </>
  );
};

export default shell;
