import React from "react";

import { css, cx } from "@styled-system/css";

import type { IConversion } from "../types/conversion";
import Message from "./Message";

type Props = {
  conversion: IConversion;
  className?: string;
};

const Conversion: React.FC<Props> = ({ conversion, className }) => {
  return (
    <div
      className={cx(
        className,
        css({
          width: "100%",
        }),
      )}
    >
      {conversion.messages.map((message) => (
        <div
          key={message.id}
          className={css({
            width: "100%",
            px: 4,
            borderBottomColor: "slate.300",
            borderBottomWidth: "1px",
            _even: {
              bg: "slate.50",
            },
          })}
        >
          <Message
            message={message}
            className={css({
              maxWidth: "content",
              mx: "auto",
            })}
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(Conversion);
