enum PurposeEnum {
    emailVerification = "email_verification",
    emailChange = "email_change",
    passwordReset = "password_reset",
}

enum ProviderEnum {
    GOOGLE = "GOOGLE",
    SYSTEM = "SYSTEM",
}
enum GenderEnum {
    Male = "Male",
    Female = "Female",
}

enum RoleEnum {
    user = "user",
    admin = "admin",
}

export { PurposeEnum, ProviderEnum, GenderEnum, RoleEnum }
