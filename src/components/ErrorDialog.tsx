import React from "react";

import { Close } from "@radix-ui/react-dialog";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { css } from "@styled-system/css";

import Dialog from "@/components/Dialog";
import button from "@/recipes/button";

const ErrorWithIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={css({ display: "flex", alignItems: "center", gap: 2 })}>
      <CrossCircledIcon width={"1.5rem"} height={"1.5rem"} className={css({ color: "red.500" })} />
      {children}
    </div>
  );
};

type Props = {
  open: boolean;
  error: string;
  description: string;
  onClose: () => void;
};

const ErrorDialog: React.FC<Props> = ({ open, error, description, onClose }) => {
  return (
    <Dialog
      open={open}
      title={<ErrorWithIcon>{error}</ErrorWithIcon>}
      description={description}
      className={css({
        w: "90%",
        maxW: "xl",
      })}
    >
      <div
        className={css({
          display: "flex",
          justifyContent: "flex-end",
        })}
      >
        <Close asChild>
          <button onClick={onClose} className={button({ visual: "solid" })}>
            閉じる
          </button>
        </Close>
      </div>
    </Dialog>
  );
};

export default React.memo(ErrorDialog);
