import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import Client from "./client";

export default async function Page() {
  const session = await getServerSession(authOptions);

  async function categoryFetch() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/plans/categories/`
      );
      const resJson = await res.json();
      return resJson;
    } catch (error) {
      console.error(error);
    }
  }

  async function goalsFetch() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/goals?state=ongoing&limit=6&offset=0`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      const resJson = await res.json();
      return resJson;
    } catch (error) {
      console.error(error);
    }
  }

  const categoryData = await categoryFetch();
  const goalsData = await goalsFetch();

  return (
    //
    <Client categoryData={categoryData} goalsData={goalsData}></Client>
  );
}
