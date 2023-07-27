import React from "react";

import { StopIcon } from "@radix-ui/react-icons";
import { ReloadIcon } from "@radix-ui/react-icons";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { css, cx } from "@styled-system/css";

import button from "@/recipes/button";

type Props = {
  stopInference?: boolean;
  reInference?: boolean;
  continue?: boolean;
  onStopInference?: () => void;
  onReInference?: () => void;
  onContinue?: () => void;
};

const InferenceController: React.FC<Props> = ({
  stopInference,
  reInference,
  continue: continueInference,
  onStopInference,
  onReInference,
  onContinue,
}) => {
  const invisibleOnDisabled = css({
    _disabled: {
      display: "none",
    },
  });

  return (
    <div
      className={css({
        position: "absolute",
        height: "3rem",
        insetInline: 0,
        top: "-3.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      })}
    >
      <button
        className={cx(button({ visual: "outline", size: "sm" }), invisibleOnDisabled)}
        disabled={!stopInference}
        onClick={onStopInference}
      >
        <StopIcon />
        <p className={css({ ml: 1.5 })}>Stop Inference</p>
      </button>
      <button
        className={cx(button({ visual: "outline", size: "sm" }), invisibleOnDisabled)}
        disabled={!reInference}
        onClick={onReInference}
      >
        <ReloadIcon />
        <p className={css({ ml: 1.5 })}>Re-Inference</p>
      </button>
      <button
        className={cx(button({ visual: "outline", size: "sm" }), invisibleOnDisabled)}
        disabled={!continueInference}
        onClick={onContinue}
      >
        <DoubleArrowRightIcon />
        <p className={css({ ml: 1.5 })}>Continue</p>
      </button>
    </div>
  );
};

export default React.memo(InferenceController);
