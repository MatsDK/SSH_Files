import { useEffect, useState } from "react";
import DataContainer from "./DataContainer";
import SshConnect from "./SshConnect";
import TabContainer from "./TabContainer";

interface TabType {
  name: string;

  location: string;
  isClosed?: boolean;
}

interface ContainerProps {
  data: { children: object[] };
  drives: any[];
  location: string;
  tabs: TabType[];
}

const Container = (props: ContainerProps) => {
  const [selected, setSelected] = useState<number | null>(0);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [dropDownState, setDropDownState] = useState<boolean>(false);
  const [tabs, setTabs] = useState<TabType[]>(props.tabs);

  const setActive = (activeIndex: number | null) => {
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

    const newTab: TabType = { name: `${location}`, location };
    setTabs((tabs) => [...tabs, newTab]);
    setSelected(idx);
    setDropDownState(false);
  };

  const closeTab = (idx: number) => {
    tabs[idx].isClosed = true;
    setTabs(tabs);

    const newOpenTabIdx: number = tabs.findIndex((_: TabType) => !_.isClosed);

    if (newOpenTabIdx == -1) setActive(null);
    else setActive(newOpenTabIdx);
  };

  const renameTab = (idx: number) => {
    const thisTab: TabType = tabs[idx];
    const newName: string | null = prompt("Enter a new Name", thisTab.name);
    if (!newName || !newName.replace(/\s/g, "").length) return;

    tabs[idx].name = newName;
    setTabs(tabs);
  };

  return (
    <div>
      <TabContainer
        newTab={newTab}
        tabs={tabs}
        setSelected={setActive}
        selected={selected}
        closeTab={closeTab}
        renameTab={renameTab}
        dropdown={{ dropDownState, setDropDownState }}
      >
        {tabs.map((tab: TabType, i: number) => (
          <div className="Page" style={{ width: "50vw" }} key={i}>
            <TabPage isSelected={selected === i}>
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
            </TabPage>
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

const TabPage = (props: TabProps) => {
  return (
    <div className={props.isSelected ? "ActivePage" : "inActivePage"}>
      {props.children}
    </div>
  );
};

export default Container;
