import { useContext, useEffect } from "react";
import { AlertProvider } from "src/context/alert";
import { ClosePopupIcon } from "./icons";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: JSX.Element;
}

let timeout: null | NodeJS.Timeout;

const Layout: React.FC<LayoutProps> = (props) => {
  const { alert, setAlert } = useContext(AlertProvider);

  useEffect(() => {
    if (timeout) clearTimeout(timeout);

    if (alert.show)
      timeout = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 4000);

    return () => {};
  }, [alert]);

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <Sidebar />
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          width: "calc(100vw - 65px)",
        }}
      >
        {alert.show && (
          <div className={"alertPopup"}>
            <div>
              <h3>Alert</h3>
              <div onClick={() => setAlert({ ...alert, show: false })}>
                <ClosePopupIcon />
              </div>
            </div>
            <p>{alert.text}</p>
          </div>
        )}
        {props.children}
        <div className="BottomBar"></div>
      </div>
    </div>
  );
};

export default Layout;
