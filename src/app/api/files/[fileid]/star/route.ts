import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ fileid: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileid } = await props.params;
    if (!fileid) {
      return NextResponse.json(
        { error: "File id is not provided!" },
        { status: 401 }
      );
    }

    //find the file from db and mark as stared

    const [matchedFile] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileid), eq(files.userId, userId)));

    if (!matchedFile) {
      return NextResponse.json({ error: "File is not Found" }, { status: 404 });
    }

    const updatedFiles = await db
      .update(files)
      .set({
        isStarred: !matchedFile.isStarred,
      })
      .where(and(eq(files.id, fileid), eq(files.userId, userId)))
      .returning();

    console.log("updated files data", updatedFiles);
    const updatedFile = updatedFiles[0];

    return NextResponse.json(updatedFile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to Update the File" },
      { status: 500 }
    );
  }
}
