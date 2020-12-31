import * as React from "react";

type LayoutType = "mobile" | "desktop";

export const useLayoutType = () => {
  const { isMobile } = useMobileDetect();
  const [windowWidth, setWindowWidth] = React.useState(() => {
    if (typeof window === "undefined") return undefined;
    return window.innerWidth;
  });

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleWindowChange = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowChange);
    return () => {
      window.removeEventListener("resize", handleWindowChange);
    };
  }, []);

  const layoutType = React.useMemo((): LayoutType => {
    if (!windowWidth) return isMobile() ? "mobile" : "desktop";
    if (windowWidth < 800) {
      return "mobile";
    }
    return "desktop";
  }, [windowWidth, isMobile]);

  return {
    isMobile: layoutType === "mobile",
    isDesktop: layoutType === "desktop",
  };
};

const getMobileDetect = (userAgent: NavigatorID["userAgent"]) => {
  const isAndroid = () => Boolean(userAgent.match(/Android/i));
  const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = () => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = () => Boolean(userAgent.match(/IEMobile/i));
  const isSSR = () => Boolean(userAgent.match(/SSR/i));
  const isMobile = () =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  const isDesktop = () => Boolean(!isMobile() && !isSSR());
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
  };
};

const useMobileDetect = () => {
  React.useEffect(() => {}, []);
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
  return getMobileDetect(userAgent);
};
