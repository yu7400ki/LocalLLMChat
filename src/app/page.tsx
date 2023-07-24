"use client";

import { css } from "@styled-system/css";

import { InitialSettings } from "@/features/chat";

export default function Home() {
  return (
    <InitialSettings
      className={css({
        height: "100%",
      })}
    />
  );
}
