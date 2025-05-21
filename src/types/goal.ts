export type GoalType = "time" | "count";
export type PeriodType = "daily" | "weekly" | "monthly";

export interface Goals {
  category: number;
  created_at: string;
  end_date: string;
  goal_type: GoalType;
  id: number;
  is_copleted: boolean;
  period_type: PeriodType;
  start_date: string;
  target: number;
  title: string;
  current: number;
}
