import React, { useRef } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { css, cx } from "@styled-system/css";

type Props = {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  children?: React.ReactNode;
};

const SelectBox: React.FC<Props> = ({
  className,
  placeholder,
  value,
  onChange,
  disabled,
  required,
  children,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const triggerStyle = css({
    "position": "relative",
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "borderWidth": "0.125rem",
    "borderStyle": "solid",
    "borderColor": "text",
    "rounded": "lg",
    "py": 3,
    "outline": "none",
    "color": "inherit",
    "gap": 5,
    "bg": "white",
    "userSelect": "none",
    "_focus": {
      borderColor: "orange.500",
    },
    "&[data-placeholder]": {
      color: "text.placeholder",
    },
  });
  const iconStyle = css({
    position: "absolute",
    right: 4,
    color: "inherit",
  });
  const contentStyle = css({
    overflow: "hidden",
    bg: "white",
    rounded: "lg",
    borderColor: "slate.200",
    borderWidth: 1,
    shadow: "sm",
  });
  const viewportStyle = css({
    p: 2,
  });
  const scrollButtonStyle = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bg: "white",
    color: "inherit",
    py: 1,
  });

  return (
    <Select.Root
      value={value}
      onValueChange={onChange}
      required={required}
      disabled={disabled}
      onOpenChange={() => {
        const width = triggerRef.current?.offsetWidth;
        contentRef.current?.style.setProperty("width", `${width}px`);
      }}
    >
      <Select.Trigger className={cx(className, triggerStyle)} ref={triggerRef}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={iconStyle}>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={contentStyle} position="popper" align="center" ref={contentRef}>
          <Select.ScrollUpButton className={scrollButtonStyle}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={viewportStyle}>{children}</Select.Viewport>
          <Select.ScrollDownButton className={scrollButtonStyle}>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default React.memo(SelectBox);
