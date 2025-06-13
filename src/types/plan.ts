export interface Plan {
  id?: number;
  date?: string;
  startTime?: string;
  start_time?: string;
  endTime?: string;
  end_time?: string;
  label?: string;
  planTitle?: string;
  description?: string;
  planDetail?: string;
  isImportant?: boolean;
  is_important?: boolean;
  color: string;
}

export interface CategoryData {
  category__name: string;
  total_time: number;
}
