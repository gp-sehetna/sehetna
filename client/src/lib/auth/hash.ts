import { compare, hash } from "bcrypt"

export const generateHash = async ({
    plainText,
    salt = Number(process.env.SALT),
}: {
    plainText: string
    salt?: number
}): Promise<string> => {
    return await hash(plainText, salt)
}

export const compareHash = async ({
    plainText,
    hash,
}: {
    plainText: string
    hash: string
}): Promise<boolean> => {
    return await compare(plainText, hash)
}
