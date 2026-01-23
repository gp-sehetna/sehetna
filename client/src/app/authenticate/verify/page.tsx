import VerifyClient from "@/app/authenticate/verify/verify-client";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyClient />
    </Suspense>
  );
}
