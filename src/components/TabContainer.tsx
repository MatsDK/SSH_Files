import { Add } from "@material-ui/icons";
import Tab from "./Tab";

interface tabType {
  name: string;
  location: string;
}

interface TabContainerProps {
  children: JSX.Element | JSX.Element[];
  selected: number | null;
  setSelected: any;

  tabs: tabType[];
  newTab: any;
  dropdown: { dropDownState: any; setDropDownState: any };
  closeTab: Function;
  renameTab: Function;
}

const TabContainer: React.SFC<TabContainerProps> = (props) => {
  return (
    <div
      style={{
        width: "calc((100vw - 65px) / 2)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="TabsBar">
        {props.tabs.map((tab: tabType, idx: number) => {
          const active = idx === props.selected ? "active" : "";

          return (
            <Tab
              key={idx}
              idx={idx}
              setSelected={props.setSelected}
              tab={tab}
              active={active}
              closeTab={props.closeTab}
              renameTab={props.renameTab}
            />
          );
        })}
        <button
          onClick={() => {
            props.dropdown.setDropDownState(!props.dropdown.dropDownState);
          }}
          tabIndex={0}
          onBlur={() => props.dropdown.setDropDownState(false)}
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
