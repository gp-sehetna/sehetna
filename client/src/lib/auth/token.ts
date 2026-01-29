import { BadRequestException, UnauthorizedException } from "@/shared/http/errors"
import { JwtPayload, Secret, sign, SignOptions, verify } from "jsonwebtoken"
export enum RoleEnum {
    user = "user",
    admin = "admin",
}
export enum SignatureLevelEnum {
    Bearer = "Bearer",
    System = "System",
}
export enum TokenTypeEnum {
    access = "access",
    refresh = "refresh",
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

export const verifyToken = ({
    token,
    secret = process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
}: {
    token: string
    secret: Secret
}): JwtPayload => {
    return verify(token, secret) as JwtPayload
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

export const createCredentials = async ({
    role = RoleEnum.user,
}: {
    role: RoleEnum
}): Promise<{
    accessToken: string
    refreshToken: string
}> => {
    const signatureLevel = detectSignatureLevel({ role: role })

    const signatures = getSignatures(signatureLevel)

    const accessToken = await generateToken({
        payload: {
            _id: "1234568",
        },
        secret: signatures.accessSignatures,
        options: { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) },
    })

    const refreshToken = await generateToken({
        payload: {
            _id: "12345678",
        },
        secret: signatures.refreshSignatures,
        options: { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) },
    })

    return { accessToken, refreshToken }
}

export const decodeToken = ({ authoriation }: { authoriation: string }) => {
    const [bearerKey, token] = authoriation.split(" ")

    if (!bearerKey || !token) {
        throw new UnauthorizedException("Missing token parts")
    }

    let type = TokenTypeEnum.access

    switch (bearerKey) {
        case SignatureLevelEnum.System:
            type = TokenTypeEnum.refresh
            break

        default:
            type = TokenTypeEnum.access
            break
    }

    const signatures = getSignatures(bearerKey as SignatureLevelEnum)
    const decoded = verifyToken({
        token: token,
        secret:
            type === TokenTypeEnum.access
                ? signatures.accessSignatures
                : signatures.refreshSignatures,
    })

    if (!decoded?._id || !decoded?.iat) {
        throw new BadRequestException("In-valid token payload")
    }

    // finding user

    // returning user and decoded in object.
}
