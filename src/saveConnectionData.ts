import { PresetData } from "pages";
import { LastConnectionData } from "./components/SshConnect";

export const saveConnectionData = (data: LastConnectionData) => {
  let configData: PresetData = JSON.parse(
    localStorage.getItem("data") ||
      "{connectionPresents: [], lastConnecetions: []}"
  );

  if (
    !(configData.lastConnections || []).find(
      (_) =>
        _.hostIp == data.hostIp &&
        _.port == data.port &&
        _.username == data.username
    )
  )
    configData = {
      ...configData,
      lastConnections: [data, ...(configData.lastConnections || [])],
    };

  if ((configData.lastConnections || []).length > 5) {
    configData.lastConnections.length = 5;
    configData.lastConnections.filter((_) => !!_);
  }

  localStorage.setItem("data", JSON.stringify(configData));
};
