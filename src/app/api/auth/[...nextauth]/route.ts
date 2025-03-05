import NextAuth, { type NextAuthOptions } from "next-auth";

import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";

import { JWT } from "next-auth/jwt";

interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
}

interface Account {
  provider: string;
}

interface SignInParams {
  user: User;
  account: Account | null;
}

interface Session {
  user?: {
    name?: string | null;
    email?: string | null;
    accessToken?: string;
  };
  expires: string;
}

interface ExtendedJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
}

const authOptions: NextAuthOptions = {
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
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  pages: {
    signIn: "/schedule",
  },

  callbacks: {
    // 로그인 시, accessToken과 refreshToken을 JWT에 저장
    async signIn(params) {
      const { user, account } = params;
      try {
        if (!user?.email) {
          console.error("Email is required for login");
          return false;
        }
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
        if (user) {
          user.accessToken = data.accessToken;
          user.refreshToken = data.refreshToken;
          user.accessTokenExpires = Date.now() + 60 * 60 * 1000;
        }
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false; // 로그인 실패
      }
    },
    async jwt(params) {
      const { token, user, account } = params;

      if (user && account) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
      }

      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() > token.accessTokenExpires
      ) {
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
          return {}; // 로그인 실패
        }
      }
      return token;
    },

    // 세션에 토큰 저장
    async session({ session, token }: { session: Session; token: any }) {
      if (!session.user) {
        session.user = {};
      }
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
