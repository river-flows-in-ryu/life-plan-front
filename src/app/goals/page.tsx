import React from "react";

import Client from "./client";

export default async function Page() {
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
  const categoryData = await categoryFetch();
  return (
    //
    <Client categoryData={categoryData}></Client>
  );
}
