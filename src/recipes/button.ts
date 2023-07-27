import { cva } from "@styled-system/css";

const button = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transitionDuration: "0.1s",
    transitionTimingFunction: "ease-in-out",
    _focusVisible: {
      outlineColor: "blue.500",
      outlineStyle: "solid",
      outlineWidth: "2px",
      outlineOffset: "1px",
    },
  },
  variants: {
    visual: {
      solid: {
        bg: {
          base: "orange.500",
          _hover: "orange.600",
          _active: "orange.600",
        },
        color: "white",
        transitionProperty: "background-color",
      },
      outline: {
        bg: {
          base: "white",
          _hover: "orange.50",
          _active: "orange.50",
        },
        color: {
          base: "orange.500",
          _hover: "orange.600",
          _active: "orange.600",
          _disabled: "text.disabled",
        },
        outlineColor: "orange.500",
        outlineStyle: "solid",
        outlineWidth: "1px",
        transitionProperty: "color",
      },
    },
    size: {
      sm: {
        rounded: "sm",
        fontSize: "sm",
        px: 2.5,
        py: 1.5,
      },
      md: {
        rounded: "md",
        fontSize: "md",
        px: 4,
        py: 2,
      },
    },
  },
  defaultVariants: {
    visual: "solid",
    size: "md",
  },
});

export default button;
