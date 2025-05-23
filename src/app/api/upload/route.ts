import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "UnAuthorized" }, { status: 401 });
    }

    //parsed the req body
    const body = await req.json();

    const { imagekit, userId: reqBodyUserId } = body;
    if (reqBodyUserId !== userId) {
      return NextResponse.json({ error: "UnAuthorized" }, { status: 401 });
    }

    if(!imagekit || !imagekit.url){
        return NextResponse.json({ error: "Invalid file upload data" }, { status: 401 });
    }

    const fileData = {
        name: imagekit.name || "untitled",
        path: imagekit.filePath || `/droply/${userId}/${imagekit.name}`,
        userId,
        size: imagekit.size || 0,
        type: imagekit.fileType || "image",
        fileUrl: imagekit.url,
        thumnailUrl: imagekit.thumbnailUrl,
        imagekitFileId: imagekit.fileId,
        parentId: null, // root level by default
        isFolder: false,
        isStarred: false,
        isTrash: false
    }

    const [newFile] = await db.insert(files).values(fileData).returning()

    return NextResponse.json(newFile)

  } catch (error) {
    return NextResponse.json({ error: error || "Failed to save you media to database" },{status:500});
  }
}
