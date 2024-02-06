import React, { useEffect } from "react";

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

declare global {
  interface Window {
    PayPal: any;
  }
}

Router.events.on("routeChangeComplete", (url) => Analytics.pageview(url));

function App({ Component, pageProps }: AppProps): React.ReactNode {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypalobjects.com/donate/sdk/donate-sdk.js`;

    script.addEventListener("load", () => {
      window.PayPal.Donation.Button({
        env: "production",
        hosted_button_id:
          process.env.PAYPAL_HOSTED_BUTTON_ID || "AGNW37L4YTKTL",
        image: {
          src: "https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif",
          title: "PayPal - The safer, easier way to pay online!",
          alt: "Donate with PayPal button",
        },
      }).render("#paypal-donate-button-container");
    });
    document.body.appendChild(script);
  }, []);

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
      <div
        id="paypal-donate-button-container"
        style={{ position: "absolute", left: "-9999em", visibility: "hidden" }}
      />
    </ChakraProvider>
  );
}

export default App;
