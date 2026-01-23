import { Secret, sign, SignOptions } from "jsonwebtoken"
export enum RoleEnum {
    user = "user",
    admin = "admin",
}
export enum SignatureLevelEnum {
    Bearer = "Bearer",
    System = "System",
}

export const generateToken = async ({
    payload,
    secret = process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
    options,
}: {
    payload: object
    secret?: Secret
    options?: SignOptions
}) => {
    return sign(payload, secret, options)
}

export const detectSignatureLevel = ({
    role = RoleEnum.user,
}: {
    role: RoleEnum
}): SignatureLevelEnum => {
    let signatureLevel: SignatureLevelEnum = SignatureLevelEnum.Bearer

    switch (role) {
        case RoleEnum.admin:
            signatureLevel = SignatureLevelEnum.System
            break

        default:
            signatureLevel = SignatureLevelEnum.Bearer
            break
    }

    return signatureLevel
}

export const getSignatures = (
    signatureLevel: SignatureLevelEnum
): {
    accessSignatures: string
    refreshSignatures: string
} => {
    const signatures: { accessSignatures: string; refreshSignatures: string } = {
        accessSignatures: "",
        refreshSignatures: "",
    }

    switch (signatureLevel) {
        case SignatureLevelEnum.Bearer:
            signatures.accessSignatures = process.env.ACCESS_USER_TOKEN_SIGNATURE as string
            signatures.refreshSignatures = process.env.REFRESH_USER_TOKEN_SIGNATURE as string
            break

        default:
            signatures.accessSignatures = process.env.ACCESS_SYSTEM_TOKEN_SIGNATURE as string
            signatures.refreshSignatures = process.env.REFRESH_SYSTEM_TOKEN_SIGNATURE as string
            break
    }

    return signatures
}

export const createCredentials = async (user: any) => {}
