import { useRef, useState } from "react";

interface TabProps {
  active: string;
  tab: any;
  setSelected: Function;
  idx: number;
  closeTab: Function;
  renameTab: Function;
}

const Tab = ({
  active,
  tab,
  setSelected,
  idx,
  closeTab,
  renameTab,
}: TabProps): JSX.Element => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const thisTab = useRef<HTMLDivElement>(null);

  const renameThisTab = () => {
    renameTab(idx);
    setShowDropDown(false);
  };

  const closeTabThis = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (thisTab && thisTab.current) {
      thisTab.current.style.display = "none";
    }

    closeTab(idx);
    setShowDropDown(false);
  };

  return (
    <div className="tabWrapper" ref={thisTab}>
      <div
        tabIndex={0}
        onBlur={(e) => setShowDropDown(false)}
        className={`TabsNavBarTab ${active && "ActiveTabsNavBarTab"}`}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowDropDown(!showDropDown);
        }}
        onClick={() => {
          setSelected(idx);
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
        {showDropDown && (
          <div className="tabDropDown">
            <span onClick={() => renameThisTab()}>Rename Tab</span>
            <span onClick={(e) => closeTabThis(e)}>Close Tab</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tab;
