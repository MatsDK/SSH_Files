interface TabContainerProps {
  children: JSX.Element | JSX.Element[];
  selected: number;
  setSelected: any;
  tabs: Array<{ name: string; location: string }>;
}

const TabContainer = (props: TabContainerProps) => {
  return (
    <div style={{ width: "45vw" }}>
      <div style={{ display: "flex", height: "20px" }}>
        {props.tabs.map((tab: any, i: number) => {
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
      {props.children}
    </div>
  );
};

export default TabContainer;
