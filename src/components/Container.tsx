import { useEffect, useState } from "react";
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
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [dropDownState, setDropDownState] = useState<boolean>(false);
  const [tabs, setTabs] = useState<TabType[]>(props.tabs);

  const setActive = (activeIndex: number) => {
    setSelected(activeIndex);
  };

  useEffect(() => {
    selectedData.forEach((x) => {
      x.classList.remove("selected");
    });
    setSelectedData([]);
  }, [selected]);

  const newTab = (location: string) => {
    const idx = tabs.length;
    const newTab: TabType = { name: `${location}${idx + 1}`, location };
    setTabs((tabs) => [...tabs, newTab]);
    setSelected(idx);
    setDropDownState(false);
  };

  return (
    <div>
      <TabContainer
        newTab={newTab}
        tabs={tabs}
        setSelected={setActive}
        selected={selected}
        dropdown={{ dropDownState, setDropDownState }}
      >
        {tabs.map((tab: TabType, i: number) => (
          <div className="Page" style={{ width: "50vw" }} key={i}>
            <Tab isSelected={selected === i}>
              {tab.location === "local" ? (
                <DataContainer
                  data={props.data}
                  drives={props.drives}
                  location="local"
                  selected={{ selectedData, setSelectedData }}
                />
              ) : (
                <SshConnect selected={{ selectedData, setSelectedData }} />
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
