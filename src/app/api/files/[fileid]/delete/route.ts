import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { imagekit } from "@/lib/imagekit";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req:NextRequest,
    props: {params:Promise<{fileid:string}>}
){

    try {

    const {userId} = await auth()
    if(!userId){
        return NextResponse.json(
            {error: "Unauthorized"},
            {status: 401}
        )
    }

    const { fileid } = await props.params;
    console.log("Fileid to delete the file : ",fileid)
    if (!fileid) {
      return NextResponse.json(
        { error: "File id is not provided!" },
        { status: 401 }
      );
    }

    // 1. Delte the Image from the Imagekit itself by using the fileID
    await imagekit.deleteFile(fileid)

    // 2. Delete the file from the database
       const deletedFile = await db
            .delete(files)
            .where(
                and(
                    eq(files.imagekitFileId, fileid),
                    eq(files.userId, userId)
                )
            )
            .returning()

        console.log("Delted file data: ", deletedFile);
            
    // 3. send the response 
        return NextResponse.json(
        { success: true, message: "File delted success" },
        { status: 200 }
      );

    } catch (error) {
        return NextResponse.json(
            {error: "Failed to delete the file!"},
            {status: 500}
        )
    }

}