import * as React from "react";

function useSticky({ windowOffset }: { windowOffset: number }) {
  const [isSticky, setSticky] = React.useState(false);
  const elementToStick = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!elementToStick.current) return;

      setSticky(
        window.pageYOffset + windowOffset > elementToStick.current.offsetTop
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", () => handleScroll);
  }, []);

  return { isSticky, elementToStick };
}

export default useSticky;
