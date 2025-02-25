import NextAuth from "next-auth";

import { cookies } from "next/headers";

import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";

import { signIn } from "next-auth/react";

import { JWT } from "next-auth/jwt";

interface ApiResponse {
  message: "SUCCESS" | "UPDATE-TRAINER" | "UPDATE-USER";
  redirect_url: string;
  access_token: string;
  refresh_token: string;
  user_id: number;
}

interface CustomToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    NaverProvider({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: "secret",
  },
  pages: {
    signIn: "/login",
  },

  callbacks: {
    // 로그인 시, accessToken과 refreshToken을 JWT에 저장
    async signIn({ user, account }) {
      try {
        // 이메일과 프로바이더를 서버로 보내서 로그인 처리
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user?.email,
              provider: account?.provider,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }

        // 로그인 성공 시 accessToken과 refreshToken을 반환
        user.accessToken = data.accessToken;
        user.refreshToken = data.refreshToken;
        user.accessTokenExpires = Date.now() + 60 * 60 * 1000;
        return user;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false; // 로그인 실패
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
      }

      if (Date.now() > token.accessTokenExpires) {
        console.log("Refresh Token:", token.refreshToken);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/accounts/refresh/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refresh: token.refreshToken,
              }),
            }
          );
          const data = await res.json();
          token.accessToken = data.access;
          token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
          return token;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false; // 로그인 실패
        }
      }
      return token;
    },

    // 세션에 토큰 저장
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
