import React, { useRef, useState } from "react";

import { ClipboardCopyIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { css, cx } from "@styled-system/css";

import button from "@/recipes/button";

import type { IMessage } from "../types/message";

type Props = {
  message: IMessage;
  onEdit: (message: IMessage) => void;
  className?: string;
};

const Message: React.FC<Props> = ({ message, className, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const snapshot = useRef<string | null>(null);

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
          userSelect: "none",
        })}
      >
        {message.role}
      </span>
      <p
        className={css({
          whiteSpace: "pre-wrap",
          outline: "none",
        })}
        contentEditable={isEditing}
        onInput={(event) => {
          if (isEditing) {
            snapshot.current = event.currentTarget.textContent ?? "";
          }
        }}
        dangerouslySetInnerHTML={{
          __html: isEditing ? snapshot.current ?? "" : message.content,
        }}
      />
      {isEditing ? (
        <Editable
          onEdit={() => {
            onEdit({
              ...message,
              content: snapshot.current ?? message.content,
            });
            setIsEditing(false);
            snapshot.current = null;
          }}
          onCancel={() => {
            setIsEditing(false);
            snapshot.current = null;
          }}
        />
      ) : (
        <MessageOperation
          onCopy={() => {
            navigator.clipboard.writeText(message.content);
          }}
          onEdit={() => {
            setIsEditing(true);
            snapshot.current = message.content;
          }}
        />
      )}
    </div>
  );
};

export default React.memo(Message);

type OperationProps = {
  onCopy: () => void;
  onEdit: () => void;
};

const MessageOperation: React.FC<OperationProps> = ({ onCopy, onEdit }) => {
  const buttonStyle = css({
    p: 1,
    cursor: "pointer",
    rounded: "sm",
    color: "slate.500",
    _hover: {
      color: "slate.800",
      bg: "rgba(0, 0, 0, 0.1)",
    },
  });

  return (
    <div
      className={css({
        display: "flex",
        alignItems: "end",
        justifyContent: "flex-end",
        gap: 1,
        h: 9,
      })}
    >
      <button onClick={onCopy} className={buttonStyle}>
        <ClipboardCopyIcon />
      </button>
      <button onClick={onEdit} className={buttonStyle}>
        <Pencil2Icon />
      </button>
    </div>
  );
};

type EditableProps = {
  onEdit: () => void;
  onCancel: () => void;
};

const Editable: React.FC<EditableProps> = ({ onEdit, onCancel }) => {
  return (
    <div
      className={css({
        display: "flex",
        alignItems: "end",
        justifyContent: "center",
        gap: 3,
        h: 9,
      })}
    >
      <button className={button({ size: "sm" })} onClick={() => onEdit()}>
        保存
      </button>
      <button className={button({ visual: "outline", size: "sm" })} onClick={() => onCancel()}>
        キャンセル
      </button>
    </div>
  );
};
