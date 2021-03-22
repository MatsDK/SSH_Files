import * as React from "react";
import { AppProps } from "next/app";
import "../src/css/global.css";

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <div className="Page">
      <Component {...pageProps} />
    </div>
  );
}
