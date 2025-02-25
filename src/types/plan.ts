export interface Plan {
  id?: number;
  date?: string;
  startTime?: string;
  start_time?: string;
  endTime?: string;
  end_time?: string;
  label: string;
  description: string;
  isImportant?: boolean;
  im_important?: boolean;
  color: string;
}

export interface CategoryData {
  category__name: string;
  total_time: number;
}
