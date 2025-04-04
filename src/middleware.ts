import type { NextRequest, NextFetchEvent } from "next/server";

import { NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  //로그인 확인
  // const token = await getToken({
  //   req,
  //   secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  // });
  // if (!token) {
  //   const { pathname } = req.nextUrl;
  //   if (pathname !== "/login") {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }
  //   return NextResponse.next();
  // }
  // // 서비스 동의 확인
  // if (req.nextUrl.pathname.startsWith("/schedule")) {
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/accounts/terms`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token.accessToken}`,
  //         },
  //       }
  //     );
  //     const data = await res.json();
  //     if (!data?.terms_status) {
  //       return NextResponse.redirect(new URL("/consent", req.url));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  //   return NextResponse.next();
  // }
}

export const config = {
  matcher: ["/schedule"],
};
