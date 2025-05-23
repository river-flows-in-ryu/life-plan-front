"use client";
import React, { Children, useEffect } from "react";

import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export default function AuthContainer({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
