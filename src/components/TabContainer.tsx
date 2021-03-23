interface tabType {
  name: string;
  location: string;
}

interface TabContainerProps {
  children: JSX.Element | JSX.Element[];
  selected: number;
  setSelected: any;
  tabs: tabType[];
}

const TabContainer = (props: TabContainerProps) => {
  return (
    <div
      style={{
        width: "50vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", height: "20px" }}>
        {props.tabs.map((tab: tabType, i: number) => {
          const active = i === props.selected ? "active" : "";
          return (
            <div key={i}>
              {active ? (
                <p style={{ color: "blue", margin: "0" }}>{tab.name}</p>
              ) : (
                <p
                  style={{ margin: "0" }}
                  onClick={() => {
                    props.setSelected(i);
                  }}
                >
                  {tab.name}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="PageWrapper">{props.children}</div>
    </div>
  );
};

export default TabContainer;
