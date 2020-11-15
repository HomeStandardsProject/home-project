import React from "react";

import { AppProps } from "next/app";
import { css, Global } from "@emotion/react";
import { Router } from "next/router";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { Analytics, GA_TRACKING_ID } from "../utils/googleAnalytics";
import { isProduction } from "../utils/constants";

const globalStyles = css`
  body {
    background-color: #f7fafc;
    min-height: 100%;
  }
`;

Router.events.on("routeChangeComplete", (url) => Analytics.pageview(url));

function App({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <ChakraProvider>
      <Head>
        {isProduction && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', '${GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
              }}
            />
          </>
        )}
      </Head>
      <Global styles={globalStyles} />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
