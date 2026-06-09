import { ClientSession, startSession } from "mongoose"

export default async function withDbTransaction<T>(
    handler: (session: ClientSession) => Promise<T>
): Promise<T> {
    const session = await startSession()

    try {
        return (await session.withTransaction(async () => {
            return await handler(session)
        })) as T
    } finally {
        await session.endSession()
    }
}
