import { useContext, useEffect } from "react";
import { AlertProvider } from "src/context/alert";
import { ClosePopupIcon } from "./icons";

interface LayoutProps {
  children: JSX.Element;
}

let timeout: null | NodeJS.Timeout;

const Layout = (props: LayoutProps): JSX.Element => {
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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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
  );
};

export default Layout;
