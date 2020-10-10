import React from "react";
import { ThemeProvider, CSSReset, theme } from "@chakra-ui/core";
import { AppProps } from "next/app";
import { css, Global } from "@emotion/core";
import { BRAND600_COLOR, BRAND700_COLOR } from "../utils/colors";

// Let's say you want to add custom colors
const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      600: BRAND600_COLOR,
      700: BRAND700_COLOR,
    },
  },
};

const globalStyles = css`
  body {
    background-color: rgba(253, 249, 241, 1);
    min-height: 100%;
  }
`;

function App({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <ThemeProvider theme={customTheme}>
      <Global styles={globalStyles} />
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default App;
