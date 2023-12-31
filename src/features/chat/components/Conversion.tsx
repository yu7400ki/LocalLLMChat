import React from "react";

import { css, cx } from "@styled-system/css";

import type { IConversion } from "../types/conversion";
import { IMessage } from "../types/message";
import Message from "./Message";

type Props = {
  conversion: IConversion;
  onEditMessage: (message: IMessage) => void;
  className?: string;
};

const Conversion: React.FC<Props> = ({ conversion, onEditMessage, className }) => {
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
            onEdit={onEditMessage}
            className={css({
              maxWidth: "breakpoint-md",
              mx: "auto",
            })}
          />
        </div>
      ))}
      <div
        className={css({
          width: "100%",
          height: "3rem",
        })}
      />
    </div>
  );
};

export default React.memo(Conversion);
