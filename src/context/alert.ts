import React from "react";
interface alertType {
  text: string;
  show: boolean;
}
interface AlertContextType {
  setAlert: React.Dispatch<React.SetStateAction<alertType>>;
  alert: alertType;
}

export const initialAlert: alertType = { text: "", show: false };
export const AlertProvider = React.createContext<AlertContextType>({
  alert: initialAlert,
  setAlert: () => {},
});
