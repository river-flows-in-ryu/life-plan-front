import { Session } from "next-auth";

interface FetchCategoryPlansProps {
  category: string | null;
  periodType: string;
  session: Session | null;
}

interface ChangePlansCategoryProps {
  plan_ids: number[];
  category_id: number;
}

export const fetchCategoryPlans = async ({
  category,
  periodType,
  session,
}: FetchCategoryPlansProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/plans?category=${category}&period=${periodType}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch plans: ${res.status}`);
  }
  const resJson = await res.json();
  return resJson;
};

export const changePlansCategory = async ({
  plan_ids,
  category_id,
}: ChangePlansCategoryProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/plans/change-category/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan_ids, category_id }),
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch plans: ${res.status}`);
  }
  const resJson = await res.json();
  return resJson;
};
