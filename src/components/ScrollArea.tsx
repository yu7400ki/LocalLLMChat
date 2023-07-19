import React, { forwardRef } from "react";

import * as Scroll from "@radix-ui/react-scroll-area";
import { css, cx } from "@styled-system/css";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

const ScrollArea = forwardRef<HTMLDivElement, Props>(({ className, children }, ref) => {
  const rootStyle = css({
    "overflow": "hidden",
    "--scrollbar-size": "10px",
  });
  const viewportStyle = css({
    width: "100%",
    height: "100%",
    rounded: "inherit",
  });
  const scrollbarStyle = css({
    display: "flex",
    userSelect: "none",
    touchAction: "none",
    p: "2px",
    bg: "transparent",
    _vertical: {
      width: "var(--scrollbar-size)",
    },
    _horizontal: {
      flexDirection: "column",
      height: "var(--scrollbar-size)",
    },
  });
  const thumbStyle = css({
    position: "relative",
    flex: 1,
    bg: "slate.500",
    rounded: "var(--scrollbar-size)",
    _before: {
      content: "''",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "100%",
      height: "100%",
      minWidth: "44px",
      minHeight: "44px",
    },
  });

  return (
    <Scroll.Root className={cx(className, rootStyle)}>
      <Scroll.Viewport className={viewportStyle} ref={ref}>
        {children}
      </Scroll.Viewport>
      <Scroll.Scrollbar className={scrollbarStyle} orientation="vertical">
        <Scroll.Thumb className={thumbStyle} />
      </Scroll.Scrollbar>
      <Scroll.Scrollbar className={scrollbarStyle} orientation="horizontal">
        <Scroll.Thumb className={thumbStyle} />
      </Scroll.Scrollbar>
      <Scroll.Corner />
    </Scroll.Root>
  );
});

ScrollArea.displayName = "ScrollArea";

export default React.memo(ScrollArea);
