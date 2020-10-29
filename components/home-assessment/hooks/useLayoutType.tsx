import * as React from "react";

type LayoutType = "mobile" | "desktop";

export const useLayoutType = () => {
  const [windowWidth, setWindowWidth] = React.useState(() => {
    if (typeof window === "undefined") return 0;
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
    if (windowWidth < 800) {
      return "mobile";
    }
    return "desktop";
  }, [windowWidth]);

  return layoutType;
};
