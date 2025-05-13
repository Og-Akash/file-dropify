import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { imagekit } from "@/lib/imagekit";


export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "UnAuthorized" }, { status: 401 });
    }

    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate Auth Params for Imagekit",
      },
      { status: 500 }
    );
  }
}
