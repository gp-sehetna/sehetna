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
    { linkName: "Live Map", linkHref: "/live-map" },
    { linkName: "Data Explorer", linkHref: "/data-explorer" },
    { linkName: "Methodology", linkHref: "/methodology" },
    { linkName: "Help & Support", linkHref: "/support" },
  ]
  return (
    <div className=" h-screen">
      <div className=" font-bold text-3xl ">Home page</div>
      {
        links.map(({ linkName, linkHref }: LinkType) => (
          <AppLink key={linkName} href={linkHref} variant="button" type="primary" size="middle">
            {linkName}
          </AppLink>
        ))
      }
    </div>
  );
}
