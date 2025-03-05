import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
    };
  }
}
