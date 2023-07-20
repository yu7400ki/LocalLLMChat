import React, { forwardRef } from "react";

import { CheckIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { css, cx } from "@styled-system/css";

type Props = {
  value: string;
  children?: React.ReactNode;
  className?: string;
};

const SelectItem = forwardRef<HTMLDivElement, Props>(({ value, children, className }, ref) => {
  return (
    <Select.Item
      value={value}
      className={cx(
        className,
        css({
          fontSize: "sm",
          color: "inherit",
          rounded: "md",
          display: "flex",
          alignItems: "center",
          py: 2,
          pl: 8,
          position: "relative",
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

SelectItem.displayName = "SelectItem";

export default React.memo(SelectItem);
