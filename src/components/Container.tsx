import { useState } from "react";
import DataContainer from "./DataContainer";
import SshConnect from "./SshConnect";
import TabContainer from "./TabContainer";

interface ContainerProps {
  data: { children: object[] };
  drives: any[];
  location: string;
  tabs: any[];
}

const Container = (props: ContainerProps) => {
  const [selected, setSelected] = useState<number>(0);
  const [tabs, setTabs] = useState<any[]>(props.tabs);

  const setActive = (activeIndex: number) => {
    setSelected(activeIndex);
  };

  return (
    <div>
      <TabContainer tabs={tabs} setSelected={setActive} selected={selected}>
        {tabs.map((tab: any, i: number) => (
          <div style={{ width: "45vw" }} key={i}>
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
    <div style={{ display: props.isSelected ? "block" : "none" }}>
      {props.children}
    </div>
  );
};

export default Container;
