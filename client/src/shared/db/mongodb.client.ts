import { InternalServerException } from "@/shared/http/errors"
import { connect } from "mongoose"


let cached = global.mongoClient

if (!cached) {
    cached = global.mongoClient = { conn: null, promise: null }
}

export async function connectMongodb() {
    const MONGODB_URI = process.env.CONNECTION_STRING!
    
    if (!MONGODB_URI) {
        throw new InternalServerException("Missing CONNECTION_STRING environment variable.")
    }
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        cached.promise = connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 60_000,
        })
    }

    cached.conn = await cached.promise
    return cached.conn
}
