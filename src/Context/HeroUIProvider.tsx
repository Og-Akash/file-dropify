"use client";

import { HeroUIProvider } from "@heroui/system";
import React from "react";

export default function HeroUIProviderContext({
  children,
}:any) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
