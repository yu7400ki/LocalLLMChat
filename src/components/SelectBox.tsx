import React from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { Root as Label } from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { css, cx } from "@styled-system/css";

type Props = {
  label: string;
  error?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  children?: React.ReactNode;
};

const SelectBox: React.FC<Props> = ({
  label,
  error,
  className,
  placeholder,
  value,
  onChange,
  disabled,
  required,
  children,
}) => {
  const labelStyle = css({
    fontSize: "md",
    lineHeight: "2.5rem",
    height: "2.5rem",
  });
  const triggerStyle = css({
    "position": "relative",
    "display": "flex",
    "h": "3.25rem",
    "w": "100%",
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
    "mb": "2.5rem",
    "_focus": {
      borderColor: "orange.500",
    },
    "&[data-placeholder]": {
      color: "text.placeholder",
    },
    "_invalid": {
      borderColor: "red.500",
      mb: "0",
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
    <Select.Root value={value} onValueChange={onChange} required={required} disabled={disabled}>
      <div className={className}>
        <Label className={labelStyle}>{label}</Label>
        <Select.Trigger className={triggerStyle} data-invalid={!!error || void 0}>
          <Select.Value placeholder={placeholder} />
          <Select.Icon className={iconStyle}>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        {error && (
          <p
            className={cx(
              labelStyle,
              css({
                color: "red.500",
              }),
            )}
          >
            {error}
          </p>
        )}
      </div>
      <Select.Portal>
        <Select.Content className={contentStyle}>
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
