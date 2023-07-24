"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { css } from "@styled-system/css";

import { Chat } from "@/features/chat";
import { conversions } from "@/features/chat/constants/storageKey";
import { IConversion } from "@/features/chat/types/conversion";
import { conversionStore } from "@/store";

export default function Page() {
  const [conversion, setConversion] = useState<IConversion | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  useEffect(() => {
    conversionStore.get<IConversion[]>(conversions)?.then((conversions) => {
      const conversion = conversions?.find((c) => c.id === id);
      if (!conversion) {
        router.push("/");
      } else {
        setConversion(conversion);
      }
    });
  }, [router, id]);

  return conversion && id ? (
    <Chat defaultConversion={conversion} className={css({ height: "100%" })} key={id} />
  ) : null;
}
