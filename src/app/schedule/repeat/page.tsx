import React from "react";

import Client from "./client";

export default async function Page() {
  const handleFetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/plans/categories/`
      );
      if (res.ok) {
        const resJson = await res.json();
        return resJson;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const categoryData = await handleFetchData();

  return (
    //
    <Client categoryData={categoryData}></Client>
  );
}
