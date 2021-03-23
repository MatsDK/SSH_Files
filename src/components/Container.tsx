import { useState } from "react";
import DataContainer from "./DataContainer";
import SshConnect from "./SshConnect";
import TabContainer from "./TabContainer";

interface TabType {
  name: string;
  location: string;
}

interface ContainerProps {
  data: { children: object[] };
  drives: any[];
  location: string;
  tabs: TabType[];
}

const Container = (props: ContainerProps) => {
  const [selected, setSelected] = useState<number>(0);
  const [tabs] = useState<TabType[]>(props.tabs);

  const setActive = (activeIndex: number) => {
    setSelected(activeIndex);
  };

  return (
    <div>
      <TabContainer tabs={tabs} setSelected={setActive} selected={selected}>
        {tabs.map((tab: TabType, i: number) => (
          <div className="Page" style={{ width: "50vw" }} key={i}>
            <Tab isSelected={selected === i}>
              {tab.location === "local" ? (
                <DataContainer
                  data={props.data}
                  drives={props.drives}
                  location="local"
                />
              ) : (
                <SshConnect />
              )}
            </Tab>
          </div>
        ))}
      </TabContainer>
    </div>
  );
};

interface TabProps {
  isSelected: boolean;
  children: JSX.Element;
}

const Tab = (props: TabProps) => {
  return (
    <div className={props.isSelected ? "ActivePage" : "inActivePage"}>
      {props.children}
    </div>
  );
};

export default Container;
