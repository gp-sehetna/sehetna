import { Flex } from "antd";
import AppLink from "../components/ui/AppLink";

type LinkType = { 
  linkName: string,
  linkHref: string
}
export default function Home() {
  const links : LinkType[]  = [
    {linkName:"Methodology", linkHref:"/methodology"},
    {linkName:"Data Explore", linkHref:"/exploreData"},
    {linkName:"Profile", linkHref:"/profile"},
    {linkName:"Support", linkHref:"/support"},
    {linkName:"login", linkHref:"/login"},
    {linkName:"signup", linkHref:"/signup"},
  ]
  return (
    <div className=" h-screen">
      <Flex className=" flex-col items-center justify-center h-full gap-2">
        <div className=" font-bold text-3xl ">Home page</div>
        
        <Flex className=" gap-2">
          {
            links.map(({linkName, linkHref}:LinkType) => (
              <AppLink href={linkHref} variant="button" type="primary" size="middle">
                {linkName}
              </AppLink>
            ))
          }
        </Flex>
      </Flex>
    </div>
  );
}
