"use client";
import { CookiesProvider, useCookies } from "react-cookie";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

import kakao from "../../../public/kakao.png";
import naver from "../../../public/naver.png";
import google from "../../../public/google.svg";

export default function Home() {
  const [cookies, setCookie, removeCookie] = useCookies(["role"]);

  const { data: session } = useSession();
  console.log(session);

  const handleSignIn = (provider: string, role: "user" | "trainer") => {
    setCookie("role", role, { path: "/", maxAge: 3600 });
    signIn(provider, {
      state: role,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-6xl	mb-[50px]"> login</h2>
      <div className="flex flex-col gap-5">
        <Image
          src={kakao}
          alt="카카오로그인"
          width={305}
          height={45}
          className="cursor-pointer"
          onClick={() => handleSignIn("kakao", "trainer")}
        />

        <div
          className="flex w-[305px] h-[45px] bg-[#03c75A] rounded cursor-pointer"
          onClick={() => handleSignIn("naver", "user")}
        >
          <Image
            src={naver}
            alt="네이버로고"
            width={45}
            height={45}
            className="w-[45px] h-[45px]"
          />
          <span className="w-[85%] leading-[45px] text-center text-white">
            네이버 로그인
          </span>
        </div>

        <div
          className="flex w-[305px] h-[45px] bg-[#f0f0f0] rounded cursor-pointer"
          onClick={() => handleSignIn("google", "user")}
        >
          <Image
            src={google}
            alt="구글로고"
            width={45}
            height={45}
            className="w-[45px] h-[45px]"
          />
          <span className="w-[85%] leading-[45px] text-center">
            Sign in with Google
          </span>
        </div>

        <button onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>
          로그아웃
        </button>
      </div>
    </div>
  );
}
