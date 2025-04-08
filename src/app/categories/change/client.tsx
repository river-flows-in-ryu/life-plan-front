"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

export default function Client() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  console.log(decodeURIComponent(category ? category : ""));
  return (
    //
    <div></div>
  );
}
