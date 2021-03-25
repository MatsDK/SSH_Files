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
          className={"NewTabButton"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30"
            height="30"
            viewBox="0 0 172 172"
          >
            <g>
              <path d="M0,172v-172h172v172z" fill="none"></path>
              <g fill="#ffffff">
                <path d="M85.83203,17.04323c-6.32845,0.09274 -11.38527,5.2949 -11.2987,11.62344v45.86667h-45.86667c-4.13529,-0.05848 -7.98173,2.11417 -10.06645,5.68601c-2.08471,3.57184 -2.08471,7.98948 0,11.56132c2.08471,3.57184 5.93115,5.74449 10.06645,5.68601h45.86667v45.86667c-0.05848,4.13529 2.11417,7.98173 5.68601,10.06645c3.57184,2.08471 7.98948,2.08471 11.56132,0c3.57184,-2.08471 5.74449,-5.93115 5.68601,-10.06645v-45.86667h45.86667c4.13529,0.05848 7.98173,-2.11417 10.06645,-5.68601c2.08471,-3.57184 2.08471,-7.98948 0,-11.56132c-2.08471,-3.57184 -5.93115,-5.74449 -10.06645,-5.68601h-45.86667v-45.86667c0.04237,-3.09747 -1.17017,-6.08033 -3.36168,-8.26973c-2.1915,-2.18939 -5.17553,-3.39907 -8.27296,-3.35371z"></path>
              </g>
            </g>
          </svg>
          <div
            className={`NewTabDropDown ${
              props.dropdown.dropDownState ? "activeDropDown" : ""
            }`}
          >
            <button onClick={() => props.newTab("local")}>Local Tab</button>
            <button onClick={() => props.newTab("remote")}>Remote Tab</button>
          </div>
        </button>
        <div className="TabsBarPlaceholder"></div>
      </div>
      <div className="PageWrapper">{props.children}</div>
    </div>
  );
};

export default TabContainer;
