import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  privateKey: (process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY as string) || "",
  publicKey: (process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string) || "",
  urlEndpoint: (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string) || "",
});
