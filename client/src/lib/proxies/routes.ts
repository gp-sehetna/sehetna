const staticRoutes = [
    "",
    "/use-cases",
    "/methodology",
    "/more-about-us",
    "/support",
    "/support/services-and-policies",
    "/map",
]

const loginRoute = "/authenticate/login"
const homeRoute = "/"
const signupRoute = "/authenticate/signup"
const forgotPasswordRoute = "/authenticate/password/forgot"
const dataExplorerRoutes = ["/data-explorer"]

const authenticateRoutes = [
    loginRoute,
    "/authenticate/login/raw",
    signupRoute,
    "/authenticate/signup/raw",
    "/authenticate/signup/credentials",
    "/authenticate/verify",
    forgotPasswordRoute,
    "/authenticate/password/old",
    "/authenticate/password/new",
]

const guestOnlyRoutes = [
    loginRoute,
    "/authenticate/login/raw",
    signupRoute,
    "/authenticate/signup/raw",
    forgotPasswordRoute,
]
const signupCredentialsRoute = "/authenticate/signup/credentials"
const verifyRoute = "/authenticate/verify"
const oldPasswordRoute = "/authenticate/password/old"
const newPasswordRoute = "/authenticate/password/new"
const settingsRoutes = ["/settings/account", "/settings/security"]

export {
    staticRoutes,
    loginRoute,
    homeRoute,
    signupRoute,
    forgotPasswordRoute,
    authenticateRoutes,
    guestOnlyRoutes,
    signupCredentialsRoute,
    verifyRoute,
    oldPasswordRoute,
    newPasswordRoute,
    settingsRoutes,
    dataExplorerRoutes,
}
