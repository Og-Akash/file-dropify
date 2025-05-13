import { HeroUIProvider } from "@heroui/system";
import React from "react";
import type { ThemeProviderProps } from "next-themes";
import { ImageKitProvider } from "imagekitio-next";

interface ProviderProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const imagekitAuthenticate = async () => {
  try {
    const res = await fetch("/api/imagekit-auth");
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.log("Error from imagekit authentication: ", error);
    throw new Error("Failed to authicate the imagekit", error);
  }
};

export function Providers({ children, themeProps }: ProviderProps) {
  return (
    <ImageKitProvider
      authenticator={imagekitAuthenticate}
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
    >
      <HeroUIProvider>{children}</HeroUIProvider>
    </ImageKitProvider>
  );
}
