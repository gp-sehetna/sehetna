import AppLink from "../components/ui/AppLink";

type LinkType = {
  linkName: string,
  linkHref: string
}
export default function Home() {
  const links: LinkType[] = [
    { linkName: "Log In", linkHref: "/authenticate/login" },
    { linkName: "Sign Up", linkHref: "/authenticate/signup" },
    { linkName: "Account Settings", linkHref: "/settings/account" },
    { linkName: "Security Settings", linkHref: "/settings/security" },
    { linkName: "Live Map", linkHref: "/map" },
    { linkName: "Data Explorer", linkHref: "/data-explorer" },
    { linkName: "Methodology", linkHref: "/methodology" },
    { linkName: "Help & Support", linkHref: "/support" },
  ]
  return (
    <div className="h-screen flex flex-col justify-center gap-4">
      <div className="font-bold flex justify-center text-3xl">Home page</div>
      <div className="flex justify-center gap-6 text-sm">
        {
          links.map(({ linkName, linkHref }: LinkType) => (
            <AppLink key={linkName} href={linkHref} variant="button" type="primary" size="middle">
              {linkName}
            </AppLink>
          ))
        }
      </div>
    </div>
  );
}
