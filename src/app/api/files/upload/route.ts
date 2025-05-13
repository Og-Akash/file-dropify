import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { v4 as uuidV4 } from "uuid";
import { imagekit } from "@/lib/imagekit";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const formUserId = formData.get("userId") as string;
    const parentId = (formData.get("parentId") as string) || null;

    if (formUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json(
        { error: "file must be provided" },
        { status: 400 }
      );
    }

    if (!parentId) {
      return NextResponse.json(
        { error: "ParentId must be provided" },
        { status: 400 }
      );
    }

    const [parentFolder] = await db
      .select()
      .from(files)
      .where(
        and(
          eq(files.userId, formUserId),
          eq(files.id, parentId),
          eq(files.isFolder, true)
        )
      );
    // validate the file types. => only allow images/pdfs

    const allowedFileTypes = ["images/", "application/pdf"];
    const forbiddenExtensions = [".exe", ".php", ".js", ".sh", ".bat"];

    const fileType = file.type;
    const fileName = file.name;
    const ext = `.${fileName.split(".").pop()}`;

    if (!allowedFileTypes.includes(fileType.toLowerCase())) {
      return NextResponse.json(
        { error: " Only Imags and Pdfs are allowed" },
        { status: 400 }
      );
    }

    if (forbiddenExtensions.includes(ext.toLowerCase())) {
      return NextResponse.json(
        { error: `File type ${ext} is not allowed to upload` },
        { status: 400 }
      );
    }

    // convert the file into buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uniqueFileName = `${uuidV4()}${ext}`;

    const uploadedData = await imagekit.upload({
      file: fileBuffer,
      fileName: uniqueFileName,
      folder: "",
      useUniqueFileName: false,
    });

    // Todo: Store the data into db

    return NextResponse.json({
      success: true,
      url: uploadedData.url,
      fileId: uploadedData.fileId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
