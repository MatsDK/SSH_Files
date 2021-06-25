import React, { useState } from "react";
import { AppProps } from "next/app";
import "../src/css/global.css";
import { AlertProvider } from "src/context/alert";

export default function MyApp({
  Component,
  pageProps,
}: AppProps): React.ReactNode {
  const [alert, setAlert] = useState({ text: "", show: false });
  const value = { alert, setAlert };

  return (
    <div className="Page">
      <AlertProvider.Provider value={value}>
        <Component {...pageProps} />
      </AlertProvider.Provider>
    </div>
  );
}
