import { randomInt } from "crypto"

const generateOtp = () => {
    return process.env.TEST_OTP ?? String(randomInt(100000, 999999))
}

export { generateOtp }
