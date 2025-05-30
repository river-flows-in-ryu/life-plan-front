import React, { useEffect } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { HexColorPicker } from "react-colorful";
import { useSession } from "next-auth/react";

import dayjs from "dayjs";

import { Checkbox } from "@/components/ui/checkbox";

import { Plan } from "@/types/plan";

interface Props {
  selectedId: number | null;
  selectedPlan: any;
  resetSignal: boolean;
  setResetSignal: (val: boolean) => void;
  data: Plan[];
  setData: (val: any) => void;
  selectedDate: Date | null;
}

interface IFormInput {
  startTime: string;
  endTime: string;
  planTitle: string;
  planDetail: string;
  isImportant: boolean;
  color: string;
}

export default function ScheduleForm({
  selectedDate,
  setData,
  data,
  selectedPlan,
  selectedId,
  resetSignal,
  setResetSignal,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<IFormInput>();

  useEffect(() => {
    if (selectedPlan) {
      reset({
        startTime: selectedPlan.startTime || "",
        endTime: selectedPlan.endTime || "",
        planTitle: selectedPlan.label || "",
        planDetail: selectedPlan.description || "",
        color: selectedPlan.color || "#ffffff",
        isImportant: selectedPlan.isImportant ?? false,
      });
    }
  }, [selectedPlan, reset]);

  useEffect(() => {
    if (resetSignal) {
      reset({
        startTime: "",
        endTime: "",
        planTitle: "",
        planDetail: "",
        color: "#ffffff",
        isImportant: false,
      });
      setResetSignal(false);
    }
  }, [resetSignal]);

  const { data: session } = useSession();

  const handleAdd = async (data: Plan) => {
    try {
      const { color, endTime, startTime, isImportant, planDetail, planTitle } =
        data;
      const formatDate = dayjs(selectedDate).format("YYYY-MM-DD");
      const submitFetch = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/plans/create/`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({
            date: formatDate,
            start_time: startTime,
            end_time: endTime,
            label: planTitle,
            description: planDetail,
            is_important: isImportant,
            color: color,
          }),
        }
      );
      const submitFetchJson = await submitFetch.json();
      alert(submitFetchJson?.message);
      if (submitFetchJson?.data) {
        const {
          color,
          description,
          end_time,
          label,
          start_time,
          id,
          is_important,
        } = submitFetchJson?.data;
        //정렬해서 넣기
        setData((prev: Plan[]) =>
          [
            ...prev,
            {
              color,
              description,
              label,
              startTime: start_time.slice(0, 5),
              endTime: end_time.slice(0, 5),
              isImportant: is_important,
              id,
            },
          ].sort((a, b) => {
            return a.startTime.localeCompare(b.startTime);
          })
        );
        setResetSignal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (selectedId) {
      await handleUpdate(data);
    } else {
      await handleAdd(data);
    }
  };

  const handleUpdate = async (data: Plan) => {
    try {
      if (!selectedId) {
        alert("선택 후 수정을 해주세요");
        return;
      }
      const formatDate = dayjs(selectedDate).format("YYYY-MM-DD");
      const { color, endTime, startTime, isImportant, planDetail, planTitle } =
        data;

      const updateFetch = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/plans/${selectedId}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({
            date: formatDate,
            start_time: startTime,
            end_time: endTime,
            label: planTitle,
            description: planDetail,
            is_important: isImportant,
            color: color,
          }),
        }
      );
      const updateFetchJson = await updateFetch.json();
      const updateData = updateFetchJson?.data;

      if (updateFetch?.ok) {
        setData((prevPlans: Plan[]) => {
          const index = prevPlans.findIndex((plan) => plan.id === selectedId);
          if (index === -1) {
            console.error("Plan not found for update");
            return prevPlans;
          }

          const updateDatas = [
            ...prevPlans.slice(0, index),
            {
              color: updateData?.color,
              description: updateData?.description,
              label: updateData?.label,
              startTime: updateData?.start_time.slice(0, 5),
              endTime: updateData?.end_time.slice(0, 5),
              isImportant: updateData?.is_important,
              id: updateData?.id,
            },
            ...prevPlans.slice(index + 1),
          ];
          return updateDatas;
        });
        alert("수정이 완료되었습니다.");
      } else {
        alert(updateFetchJson?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickDelete = async () => {
    if (window.confirm("이 일정을 삭제하시겠습니까?")) {
      const delFetch = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/plans/${selectedId}/delete/`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      const delFetchJson = await delFetch.json();
      if (delFetchJson?.message === "SUCCESS") {
        alert("성공적으로 삭제되었습니다.");
        const newData = data?.filter((data: any) => data?.id !== selectedId);
        setData(newData);
        setResetSignal(true);
      } else {
        alert("삭제에 실패하였습니다. 다시 시도해주세요");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="border border-[#e5e7eb] rounded-2xl bg-white w-full sm:w-[330px] p-4">
        <h3 className=" text-2xl	font-bold">Schedule Details</h3>
        <div className="mt-6">
          <label className="block font-medium">시작시간</label>
          <input
            type="time"
            className="border border-[#e5e7eb] w-full h-10 pl-2 mt-2"
            {...register("startTime", {
              required: "시작 시간을 작성해주세요.",
              min: { value: "00:00", message: "최소 시간은 00:00입니다." },
              max: { value: "24:00", message: "최대 시간은 24:00입니다." },
            })}
          />
        </div>
        <div className="mt-4">
          <label className="block font-medium">종료시간</label>
          <input
            type="time"
            className="border border-[#e5e7eb] w-full h-10 pl-2 mt-2"
            {...register("endTime", {
              required: "시작 시간을 작성해주세요.",
              min: { value: "00:00", message: "최소 시간은 00:00입니다." },
              max: { value: "24:00", message: "최대 시간은 24:00입니다." },
            })}
          />
        </div>
        <div className="mt-4">
          <label className="block font-medium">일정제목</label>
          <input
            className="border border-[#e5e7eb] w-full h-10 pl-2 mt-2"
            type="text"
            {...register("planTitle", {
              required: "일정 제목을 입력해주세요.",
            })}
          />
        </div>
        <div className="mt-4 ">
          <label className="block font-medium">일정상세</label>
          <textarea
            className="border border-[#e5e7eb] w-full h-[60px] pl-2 pt-1 mt-2"
            {...register("planDetail", {
              required: "일정 상세를 작성해주세요.",
            })}
          />
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Controller
            name="isImportant"
            control={control}
            render={({ field }) => (
              <>
                <Checkbox
                  id="terms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  주요 일정
                </label>
              </>
            )}
          />
        </div>
        <div className="mt-6">
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <HexColorPicker
                color={field.value}
                onChange={field.onChange}
                style={{ margin: "auto" }}
              />
            )}
          />
        </div>
        <div className="flex gap-2 my-2.5 justify-center">
          {!selectedId && (
            <button className="bg-[#2564eb] w-full h-10 rounded text-white">
              Add
            </button>
          )}
          {selectedId && (
            <>
              <button
                className="bg-[#eab208] w-full h-10 rounded text-white"
                // onClick={handleClickUpdate}
              >
                Edit
              </button>
              <button
                className="bg-red-500 w-full h-10 rounded text-white"
                onClick={handleClickDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
        <button
          className="bg-black text-white w-full h-10 rounded"
          onClick={() => setResetSignal(true)}
        >
          Reset All
        </button>
      </div>
    </form>
  );
}
