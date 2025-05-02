"use client";

import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
}

interface Props {
  title: string;
  setTitle: (value: string) => void;
  selectedCategory: string | undefined;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
  categoryData: Category[];
}

export default function TitleAndCategorySelector({
  title,
  setTitle,
  selectedCategory,
  setSelectedCategory,
  categoryData,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
      <div className="">
        <label className="block mb-2 font-medium">일정 제목</label>
        <input
          type="text"
          onChange={(event) => setTitle(event?.target?.value)}
          value={title}
          placeholder="일정 제목을 입력해주세요"
          className="h-10 w-full border rounded p-3"
        />
      </div>
      <div className="">
        <label className="block mb-2 font-medium">카테고리</label>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          required
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Cateogry" />
          </SelectTrigger>
          <SelectContent>
            {categoryData?.map((categoryItem: { id: string; name: string }) => {
              const { id, name } = categoryItem;
              return (
                <SelectItem value={name} key={id}>
                  {name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
