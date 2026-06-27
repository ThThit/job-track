import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, { // use mongo adapter to write directly to db
        client,
    }),
    emailAndPassword: {
        enabled: true // enable singup with email
    }
});

export async function getSession() {
    const result = await auth.api.getSession({
        headers: await headers(),
    });
}