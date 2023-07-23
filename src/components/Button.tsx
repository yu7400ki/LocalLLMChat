import React from "react";
import { forwardRef } from "react";

import { css, cx } from "@styled-system/css";

type Props = JSX.IntrinsicElements["button"];

const Button = forwardRef<HTMLButtonElement, Props>(({ className, children, ...props }, ref) => {
  return (
    <button
      className={cx(
        className,
        css({
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: "0.125rem",
          borderStyle: "solid",
          borderColor: "text",
          rounded: "lg",
          height: "3.25rem",
          cursor: "pointer",
          color: "inherit",
          outline: "none",
          _hover: {
            color: "orange.500",
          },
          _focus: {
            borderColor: "orange.500",
          },
        }),
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default React.memo(Button);
