interface LayoutProps {
  children: JSX.Element;
}

const Layout = (props: LayoutProps): JSX.Element => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {props.children}
      <div className="BottomBar"></div>
    </div>
  );
};

export default Layout;
