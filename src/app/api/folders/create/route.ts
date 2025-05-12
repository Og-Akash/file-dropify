import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidV4} from "uuid"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "UnAuthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, userId: bodyUserId, parentId } = body;

    if (userId !== bodyUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Folder name must be provided." },
        { status: 400 }
      );
    }

    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.userId, bodyUserId),
            eq(files.isFolder, true)
          )
        );

      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent Folder not Exist" },
          { status: 401 }
        );
      }
    }

    // create a folder in a database

    const folderData = {
      id: uuidV4(),
      name:name.trim(),
      path: `/folders/${bodyUserId}/${uuidV4()}`,
      size: 0,
      type: "folder",
      fileUrl: "",
      thumnailUrl: null,
      userId,
      parentId,
      isFolder: true,
      isStarred: false,
      isTrash: false
    };

    const [newFolder] = await db.insert(files).values(folderData).returning();
    return NextResponse.json({
      success: true,
      message: "folder created successfully.",
      folder: newFolder,
    });
  } catch (error) {}
}
