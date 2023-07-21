import React, { forwardRef } from "react";

import { CheckIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { css, cx } from "@styled-system/css";

type Props = {
  value: string;
  children?: React.ReactNode;
  className?: string;
};

const SelectOption = forwardRef<HTMLDivElement, Props>(({ value, children, className }, ref) => {
  return (
    <Select.Item
      value={value}
      className={cx(
        className,
        css({
          position: "relative",
          display: "flex",
          alignItems: "center",
          py: 3,
          pl: 8,
          rounded: "md",
          fontSize: "md",
          color: "inherit",
          userSelect: "none",
          _highlighted: {
            outline: "none",
            color: "white",
            bg: "orange.500",
          },
        }),
      )}
      ref={ref}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator
        className={css({
          position: "absolute",
          left: 2,
          display: "inline-flex",
          justifyContent: "center",
        })}
      >
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

SelectOption.displayName = "SelectOption";

export default React.memo(SelectOption);
