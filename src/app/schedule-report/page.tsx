import Client from "./client";

import { getServerSession } from "next-auth/next";

// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function page() {
  // const session = await getServerSession(authOptions);
  return (
    //
    <Client />
  );
}
