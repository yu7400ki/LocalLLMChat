import { cva } from "@styled-system/css";

const button = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    rounded: "md",
    fontSize: "md",
    px: 4,
    py: 2,
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
          base: "transparent",
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
  },
  defaultVariants: {
    visual: "solid",
  },
});

export default button;
