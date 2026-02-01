import { DUser, RoleEnum } from "@/shared/db/model/user.model"
import { BadRequestException, UnauthorizedException } from "@/shared/http/errors"
import { sign, JwtPayload, verify } from "jsonwebtoken"

export enum SignatureLevelEnum {
    Bearer = "Bearer",
    System = "System",
}
export enum TokenTypeEnum {
    access = "access",
    refresh = "refresh",
}

export const detectSignatureLevel = (role = RoleEnum.user): SignatureLevelEnum => {
    return role === RoleEnum.admin ? SignatureLevelEnum.System : SignatureLevelEnum.Bearer
}

export const getSignatures = (level: SignatureLevelEnum) => {
    const signatures = { access: "", refresh: "" }

    switch (level) {
        case SignatureLevelEnum.Bearer:
            signatures.access = process.env.ACCESS_USER_TOKEN_SIGNATURE!
            signatures.refresh = process.env.REFRESH_USER_TOKEN_SIGNATURE!
            break

        default:
            signatures.access = process.env.ACCESS_SYSTEM_TOKEN_SIGNATURE!
            signatures.refresh = process.env.REFRESH_SYSTEM_TOKEN_SIGNATURE!
            break
    }

    return signatures
}

export const createTokens = async (user: DUser) => {
    const signatureLevel = detectSignatureLevel(user.role)
    const signatures = getSignatures(signatureLevel)
    const payload = { _id: user._id }

    const accessToken = sign(payload, signatures.access, { expiresIn: "30m" }) // ACCESS_TOKEN
    const refreshToken = sign(payload, signatures.refresh, { expiresIn: "30d" }) // REFRESH_TOKEN

    return { accessToken, refreshToken }
}

export const decodeToken = (authoriation: string, type = TokenTypeEnum.access) => {
    const [bearerKey, token] = authoriation.split(" ")

    if (!bearerKey || !token) throw new UnauthorizedException("Invalid authorization format")

    // switch (bearerKey) {
    //     case SignatureLevelEnum.System:
    //         type = TokenTypeEnum.refresh
    //         break

    //     default:
    //         type = TokenTypeEnum.access
    //         break
    // }

    const signatures = getSignatures(bearerKey as SignatureLevelEnum)

    const decoded = verify(
        token,
        type === TokenTypeEnum.access ? signatures.access : signatures.refresh
    ) as JwtPayload

    if (!decoded?._id || !decoded?.iat) throw new BadRequestException("Invalid token payload")

    // finding user

    // returning user and decoded in object.
}
