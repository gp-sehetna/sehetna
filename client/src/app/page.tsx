
import AppInput from "../components/ui/AppInput";
import Flex from "../components/ui/Flex";
import Heading from "../components/ui/Heading";
import WideButton from "../components/ui/WideButton";
import { Button } from "@/components/ui/shadcn/button";
import MapView from "@/components/maplibre/MyMap";

// type LinkType = {
//   linkName: string;
//   linkHref: string;
// }

export default function Home() {
  // const links: LinkType[] = [
  //   { linkName: "Log In", linkHref: "/authenticate/login" },
  //   { linkName: "Sign Up", linkHref: "/authenticate/signup" },
  //   { linkName: "Account Settings", linkHref: "/settings/account" },
  //   { linkName: "Security Settings", linkHref: "/settings/security" },
  //   { linkName: "Live Map", linkHref: "/map" },
  //   { linkName: "Data Explorer", linkHref: "/data-explorer" },
  //   { linkName: "Methodology", linkHref: "/methodology" },
  //   { linkName: "Help & Support", linkHref: "/support" },
  // ];
  return (
    <div className=" h-screen flex w-full items-center justify-center flex-col">
      {/* <Flex className="px-10 w-full">
        <div className="border-2 w-full border-dashed border-primary p-6 hover:p-12 hover:rounded-none base-transition flex gap-3 flex-col rounded-lg">
          <Flex direction="col">
            <Heading size={2} color="black">
              Headings
            </Heading>
            <Flex direction="col">
              <h1>Heading 1</h1>
              <h2>Heading 2</h2>
              <h3>Heading 3</h3>
              <h4>Heading 4</h4>
              <h5>Heading 5</h5>
              <h6>Heading 6</h6>
            </Flex>
          </Flex>
        </div>
        <Flex direction="col">

          <div className="border-2 w-full border-dashed border-primary p-6 hover:p-12 hover:rounded-none base-transition flex gap-3 flex-col rounded-lg">
            <Flex direction="col">
              <Heading size={2} color="black">
                Buttons
              </Heading>
              <Flex>
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
              </Flex>
            </Flex>
          </div>

          <div className="border-2 border-dashed border-primary p-6 hover:p-12 hover:rounded-none base-transition flex gap-3 flex-col rounded-lg">
            <Flex direction="col">
              <Heading size={2} color="black">
                Auth Buttons
              </Heading>
              <Flex direction="col">
                <WideButton variant="outline">Outline Button</WideButton>
                <WideButton variant="black">Black Button</WideButton>
                <WideButton variant="gradient">Gradient Button</WideButton>
              </Flex>
            </Flex>
          </div>
        </Flex>
        </Flex> */}
        {/* <div className="border-2 w-full border-dashed border-primary p-6 hover:p-12 hover:rounded-none base-transition flex gap-3 flex-col rounded-lg"> */}
          {/* <Flex direction="col"> */}
            {/* <Heading size={2} color="black">
              Inputs
            </Heading> */}
              {/* <AppInput label="User Name" placeholder="Enter Your Name..." type="text" /> */}
              {/* <AppInput label="Password"   type="password" /> */}
            {/* <Flex direction="col">
            </Flex> */}
          {/* </Flex> */}
        {/* </div> */}
      
      <MapView />
    </div>
  );
}
