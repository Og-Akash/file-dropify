import {pgTable,integer,boolean,uuid,text,timestamp} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),

    // basic file/folder informations
    name:text("name").notNull(),
    path:text("path").notNull(), //? /documents/images/demp.png
    size:integer("size").notNull(),
    type: text("type").notNull(),

    // storage informations
    fileUrl:text("file_url").notNull(),
    thumnailUrl: text("thumnail_url"),
    imagekitFileId: text("imagekit_file_id").notNull(),

    // Ownership information
    userId: uuid("user_id").notNull(),
    parentId: text("parent_id"), //? show the parent if there is any (if root them null)

    // file/folder flags
    isFolder: boolean("is_folder").default(false).notNull(),
    isStarred:boolean("is_starred").default(false).notNull(),
    isTrash: boolean("is_trash").default(false).notNull(),

    //time
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

})

export const filesRelations = relations(files , ({many,one}) => ({
    parent: one(files,{
        fields: [files.parentId],
        references: [files.id]
    }),
    children: many(files)
}))

// type definations
export const File = typeof files.$inferSelect
export const newFile = typeof files.$inferInsert