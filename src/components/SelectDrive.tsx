import { useEffect, useState } from "react";
import Select from "react-select";

const SelectDrive = (props) => {
  const [drives, setDrives] = useState<any[]>(props.drives);
  const [SelectId, setSelectId] = useState<number | undefined>(undefined);

  useEffect(() => {
    setSelectId(Math.random());
    setDrives(
      props.drives.map((x: any, i: number) => ({
        value: x.name,
        label: x.name + " " + (x.label || x.physical),
      }))
    );
  }, []);

  const colourStyles = {
    control: (styles: any) => ({
      ...styles,
      color: "#000",
      backgroundColor: "var(--primaryBG)",
      width: "120px",
      padding: "0",
      fontSize: "14px",
      height: "30px",
      boxShadow: "none",
      marginBottom: "10px",
      minHeight: "24px",
      borderColor: "var(--lightTextColor) !important",
    }),
    option: (styles: any, { isFocused }) => {
      return {
        ...styles,
        margin: "0",
        fontSize: "14px",

        padding: "2px 6px",
        height: "26px",
        borderBottom: "1px solid var(--secondaryBG)",
        backgroundColor: "var(--primaryBG)",
        color: isFocused ? "var(--mainTextColor)" : "var(--secondaryTextColor)",
        width: "150px",
        overflow: "hidden !important",
      };
    },
    menuList: (provided: any) => {
      return {
        ...provided,
        paddingTop: 0,
        paddingBottom: 0,
        border: "1px solid var(--lightTextColor)",
        overflow: "hidden",
        marginTop: "-5px",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
        borderRadius: "4px",
        backgroundColor: "var(--primaryBG)",
      };
    },
    singleValue: (provided: any) => {
      return {
        ...provided,
        fontSize: "14px",
        color: "var(--mainTextColor)",
      };
    },
    dropdownIndicator: (provided: any) => {
      return { ...provided, padding: "0" };
    },
    indicatorSeparator: (provided: any) => {
      return { ...provided, backgroundColor: "transparent" };
    },
  };

  return SelectId !== undefined ? (
    <div>
      <Select
        instanceId={`select${SelectId}`}
        className="Select"
        isSearchable={false}
        options={drives}
        defaultValue={
          props.drives.map((x: any, i: number) => ({
            value: x.name,
            label: x.name + " " + (x.label || x.physical),
          }))[0]
        }
        clearable={false}
        styles={colourStyles}
        onChange={(e: any) => props.setActiveDrive(e.value)}
      />
    </div>
  ) : (
    <div></div>
  );
};

export default SelectDrive;
