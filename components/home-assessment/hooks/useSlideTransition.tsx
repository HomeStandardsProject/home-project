import * as React from "react";
import { useTransition } from "react-spring";

export const useSlideTransition = (direction: "in" | "out") => {
  const [renderAnimation, setRenderAnimation] = React.useState(false);

  const transitions = useTransition(direction, (p) => p, {
    immediate: !renderAnimation,
    from: {
      opacity: 0,
      transform: `translate3d(${direction === "in" ? "-50%" : "50%"},0,0)`,
    },
    enter: { opacity: 1, transform: "translate3d(0,0,0)" },
    leave: {
      position: "absolute",
      opacity: 0,
      left: direction === "in" ? "150%" : "-150%",
    },
    // @ts-ignore Bad typing of useTransition
    onRest: () => {
      setRenderAnimation(true);
    },
  });

  return transitions;
};
