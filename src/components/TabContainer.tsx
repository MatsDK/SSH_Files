import { Add } from "@material-ui/icons";

interface tabType {
  name: string;
  location: string;
}

interface TabContainerProps {
  children: JSX.Element | JSX.Element[];
  selected: number;
  setSelected: any;
  tabs: tabType[];
  newTab: any;
  dropdown: { dropDownState: any; setDropDownState: any };
}

const TabContainer = (props: TabContainerProps) => {
  const tabMenu = (e: any, tab: tabType) => {
    e.preventDefault();
    console.log(tab);
  };

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
              onContextMenu={(e) => tabMenu(e, tab)}
              onClick={() => {
                props.setSelected(i);
              }}
            >
              <p
                style={{
                  color: active
                    ? "var(--mainTextColor)"
                    : "var(--secondaryTextColor)",
                }}
              >
                {tab.name}
              </p>
            </div>
          );
        })}
        <button
          onClick={() =>
            props.dropdown.setDropDownState(!props.dropdown.dropDownState)
          }
          className={`NewTabButton${
            props.dropdown.dropDownState ? " ActiveNewTabButton" : ""
          }`}
        >
          <div className="NewTabIcon">
            <Add />
          </div>
          <div
            className={`NewTabDropDown ${
              props.dropdown.dropDownState ? "activeDropDown" : ""
            }`}
          >
            <span onClick={() => props.newTab("local")}>Local Tab</span>
            <span onClick={() => props.newTab("remote")}>Remote Tab</span>
          </div>
        </button>
        <div className="TabsBarPlaceholder"></div>
      </div>
      <div className="PageWrapper">{props.children}</div>
    </div>
  );
};

export default TabContainer;
