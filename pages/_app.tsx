import React from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { AppProps } from "next/app";
import { css, Global } from "@emotion/core";

const globalStyles = css`
  body {
    background-color: #f7fafc;
    min-height: 100%;
  }
`;

function App({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <ThemeProvider>
      <Global styles={globalStyles} />
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default App;
