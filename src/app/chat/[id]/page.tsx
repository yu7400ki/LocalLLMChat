"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { css } from "@styled-system/css";

import { Chat } from "@/features/chat";
import { conversions } from "@/features/chat/constants/storageKey";
import { IConversion } from "@/features/chat/types/conversion";
import { storage } from "@/utils/storage";

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  const [conversion, setConversion] = useState<IConversion | null>(null);
  const router = useRouter();

  useEffect(() => {
    const conversion = storage.getJSON<IConversion[]>(conversions)?.find((c) => c.id === params.id);
    if (!conversion) {
      router.push("/");
    } else {
      setConversion(conversion);
    }
  }, [params.id, router]);

  return conversion ? (
    <Chat defaultConversion={conversion} className={css({ height: "100%" })} key={params.id} />
  ) : null;
}
