import React from "react";

import { Root as Label } from "@radix-ui/react-label";
import { css } from "@styled-system/css";

type Props = {
  id: string;
  label: string;
  error?: string;
} & JSX.IntrinsicElements["textarea"];

const Textarea: React.FC<Props> = ({ id, label, error, className, ...props }) => {
  return (
    <div className={className}>
      <Label
        htmlFor={id}
        className={css({
          fontSize: "md",
          lineHeight: "2.5rem",
          height: "2.5rem",
        })}
      >
        {label}
      </Label>
      <textarea
        id={id}
        {...props}
        className={css({
          "width": "100%",
          "fontSize": "md",
          "p": 3,
          "borderWidth": "0.125rem",
          "borderStyle": "solid",
          "rounded": "lg",
          "outline": "none",
          "color": "inherit",
          "mb": "2.5rem",
          "resize": "none",
          "_placeholder": {
            color: "text.placeholder",
          },
          "&:focus": {
            borderColor: "orange.500",
          },
          "_invalid": {
            borderColor: "red.500",
            mb: "0",
          },
        })}
        data-invalid={!!error || void 0}
        autoComplete="off"
      />
      {error && (
        <p
          className={css({
            fontSize: "md",
            color: "red.500",
            lineHeight: "2.5rem",
            height: "2.5rem",
          })}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default React.memo(Textarea);
