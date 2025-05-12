import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from 'drizzle-orm/neon-http/migrator';
import {neon} from "@neondatabase/serverless"

import * as dotenv from "dotenv"

dotenv.config({
    path: ".env.local"
})

if (!process.env.DATABASE_URL) {
    throw new Error("Database Url is Not Present on .env file");
}

async function migrateRun(){
   try {
    const sql = neon(process.env.DATABASE_URL!)
    const db = drizzle(sql)

    await migrate(db, {
        migrationsFolder: "./drizzle"
    })
    console.log("All migrations are success ✅");
    
   } catch (error) {
    console.log("Failed to migrate the db ❌", error);
    process.exit(1)
   }
}

migrateRun()