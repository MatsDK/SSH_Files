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
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="TabsBar">
        {props.tabs.map((tab: tabType, i: number) => {
          const active = i === props.selected ? "active" : "";
          return (
            <div
              className={`TabsNavBarTab ${active && "ActiveTabsNavBarTab"}`}
              key={i}
              onClick={() => {
                props.setSelected(i);
              }}
            >
              <p>{tab.name}</p>
            </div>
          );
        })}
        <div className="TabsBarPlaceholder"></div>
      </div>
      <div className="PageWrapper">{props.children}</div>
    </div>
  );
};

export default TabContainer;
