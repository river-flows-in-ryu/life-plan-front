import { Session } from "next-auth";

interface FetchCategoryPlansProps {
  category: string | null;
  periodType: string;
  session: Session | null;
  start?: string;
  end?: string;
}

interface ChangePlansCategoryProps {
  plan_ids: number[];
  category_id: number;
}

export const fetchCategoryPlans = async ({
  category,
  periodType,
  session,
  start,
  end,
}: FetchCategoryPlansProps) => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/plans?category=${category}&period=${periodType}`;
  if (periodType === "custom" && start && end) {
    url += `&start=${start}&end=${end}`;
  }
  const res = await fetch(`${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });
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
