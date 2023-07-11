import React from "react";

import { css, cx } from "@styled-system/css";

type Props = {
  role: "User" | "Bot";
  message: string;
  className?: string;
};

const Message: React.FC<Props> = ({ role, message, className }) => {
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
        {role}
      </span>
      <p>{message}</p>
    </div>
  );
};

export default React.memo(Message);
