import { useEffect, useState } from "react";
import Select from "react-select";
import { styles } from "./ui/selectStyles";

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
        styles={styles}
        onChange={(e: any) => props.setActiveDrive(e.value)}
      />
    </div>
  ) : (
    <div></div>
  );
};

export default SelectDrive;
