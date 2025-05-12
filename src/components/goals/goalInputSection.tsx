import React from "react";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  categoryData: { id: number; name: string }[];
}

interface IFormInput {
  title: string;
  category: string;
  goalType: "time" | "count";
  periodType: "daily" | "weekly" | "monthly";
  quantity: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export default function GoalInputSection({ categoryData }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    defaultValues: {
      category: "",
      title: "",
      goalType: undefined,
      periodType: undefined,
      quantity: undefined,
      startDate: undefined,
      endDate: undefined,
    },
  });

  const { data: session } = useSession();

  const onSubmit: SubmitHandler<IFormInput> = (data) => handleGoalSubmit(data);

  const handleGoalSubmit = async (data: IFormInput) => {
    const start_date = dayjs(data.startDate).format("YYYY-MM-DD");
    const end_date = dayjs(data.endDate).format("YYYY-MM-DD");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          title: data.title,
          category: data.category,
          goal_type: data.goalType,
          period_type: data.periodType,
          target: data.quantity,
          start_date,
          end_date,
        }),
      });
      if (res.ok) {
        const postData = await res.json();
        reset();
        alert(postData?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="border rounded p-6">
        <h3 className="text-2xl font-semibold">새 목표 추가</h3>
        <p className="block text-sm mb-6 mt-1.5">
          새로운 목표를 설정하고 달성해보세요
        </p>
        <label className="text-sm font-medium">목표 제목</label>
        <input
          type="text"
          className="w-full h-10 border rounded px-3 py-2 text-sm mt-2"
          placeholder="목표 제목을 입력하세요"
          {...register("title", { required: "카테고리를 선택해주세요" })}
        />
        {errors.title && (
          <p className={`mt-1 text-sm text-red-500  `}>
            {errors.title.message}
          </p>
        )}
        <label className="text-sm font-medium mt-4 block">카테고리</label>
        <Controller
          name="category"
          control={control}
          rules={{ required: "카테고리를 선택해주세요" }}
          render={({ field }) => (
            <div className="mt-2">
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryData?.map((item) => {
                    const { id, name } = item;
                    return (
                      <SelectItem key={id} value={String(id)}>
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className={`mt-1 text-sm text-red-500  `}>
                  {errors.category?.message}
                </p>
              )}
            </div>
          )}
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium ">목표 유형</label>
            <Controller
              name="goalType"
              rules={{ required: "유형을 선택해주세요" }}
              control={control}
              render={({ field }) => (
                <div className="mt-2">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="시간/횟수" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">시간</SelectItem>
                      <SelectItem value="count">횟수</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            {errors.goalType && (
              <p className="mt-1 text-sm text-red-500">
                {errors.goalType?.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium ">기간</label>
            <Controller
              name="periodType"
              rules={{ required: "기간을 선택해주세요" }}
              control={control}
              render={({ field }) => (
                <div className="mt-2">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="일일/주간/월간" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">일일</SelectItem>
                      <SelectItem value="weekly">주간</SelectItem>
                      <SelectItem value="monthly">월간</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            {errors.periodType && (
              <p className="mt-1 text-sm text-red-500">
                {errors.periodType?.message}
              </p>
            )}
          </div>
        </div>
        <label className="mt-4 block text-sm font-medium">
          목표치 (시간 / 횟수)
        </label>
        <input
          type="number"
          className="w-full h-10 border rounded px-3 py-2 text-sm mt-2"
          {...register("quantity", {
            required: "목표치를 입력해주세요",
            min: {
              value: 1,
              message: "최소 1 이상이어야 합니다.",
            },
            pattern: {
              value: /^[0-9]*$/,
              message: "숫자만 입력 가능합니다.",
            },
          })}
          placeholder="시간 / 횟수를 작성해주세요"
        />
        {errors.quantity && (
          <p className={`mt-1 text-sm text-red-500  `}>
            {errors.quantity?.message}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className=" text-sm font-medium">시작일</label>
            <Controller
              name="startDate"
              control={control}
              rules={{ required: "시작일을 선택해주세요" }}
              render={({ field }) => (
                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {field.value ? (
                          format(field.value, "yyyy.MM.dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.startDate?.message}
              </p>
            )}
          </div>
          <div>
            <label className=" text-sm font-medium">종료일</label>
            <Controller
              name="endDate"
              control={control}
              rules={{ required: "종료일을 선택해주세요" }}
              render={({ field }) => (
                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {field.value ? (
                          format(field.value, "yyyy.MM.dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.endDate?.message}
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full h-10 rounded bg-black text-white mt-6"
        >
          목표 추가
        </button>
      </div>
    </form>
  );
}
