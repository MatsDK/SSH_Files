import { useEffect, useState } from "react";
import DataContainer from "./DataContainer";
import SshConnect from "./SshConnect";
import TabContainer from "./TabContainer";

export interface sshConnectionData {
  host: string | null;
  port: number | null;
  userName: string | null;
}

interface TabType {
  name: string;
  isClosed?: boolean;
  sshConnectionData?: sshConnectionData;
  location: "remote" | "local";
}

interface ContainerProps {
  data: { children: object[] };
  drives: any[];
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

  const newTab = (location: "remote" | "local") => {
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

  const renameTab = (idx: number, newName: string) => {
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
          <div
            className="Page"
            // style={{ width: "calc((100vw - 65px)/2)" }}
            key={i}
          >
            <TabPage isSelected={selected === i}>
              {tab.location === "local" ? (
                <DataContainer
                  data={props.data}
                  drives={props.drives}
                  location="local"
                  selected={{ selectedData, setSelectedData }}
                />
              ) : (
                <SshConnect
                  selected={{ selectedData, setSelectedData }}
                  sshConnectionData={
                    tab.sshConnectionData || {
                      userName: null,
                      host: null,
                      port: null,
                    }
                  }
                />
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
