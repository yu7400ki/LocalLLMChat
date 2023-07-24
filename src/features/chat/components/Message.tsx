import React from "react";

import { css, cx } from "@styled-system/css";

import type { IMessage } from "../types/message";

type Props = {
  message: IMessage;
  className?: string;
};

const Message: React.FC<Props> = ({ message, className }) => {
  return (
    <div
      className={cx(
        className,
        css({
          display: "flex",
          flexDirection: "column",
          p: 2,
        }),
      )}
    >
      <span
        className={css({
          fontWeight: "extrabold",
          mb: 1,
        })}
      >
        {message.role}
      </span>
      <p
        className={css({
          whiteSpace: "pre-wrap",
        })}
      >
        {message.content}
      </p>
    </div>
  );
};

export default React.memo(Message);
