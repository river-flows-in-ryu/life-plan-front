import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import Client from "./client";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const today = new Date();

  const formatteredDate = today.toISOString().slice(0, 10);

  const planFetch = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/plans?date=${formatteredDate}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );
    return await res.json();
  };

  const goalFetch = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/goals?state=ongoing&limit=3&offset=0`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );
    return await res.json();
  };

  const categoryTimeFetch = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/plans/dashboard/category-time/?period=custom&start_date=${formatteredDate}&end_date=${formatteredDate}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );
    return await res.json();
  };

  const todayPlan = await planFetch();
  const userGoal = await goalFetch();
  const categoryTime = await categoryTimeFetch();
  return (
    <Client
      todayPlan={todayPlan}
      goals={userGoal?.results}
      categoryTime={categoryTime}
    />
  );
}
