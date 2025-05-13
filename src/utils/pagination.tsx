import React, { useState } from "react";

interface Props {
  total: number;
  pageSize: number;
  currentPage: number;
  blockSize?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  total,
  pageSize,
  currentPage,
  blockSize = 5,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(total / pageSize);
  const currentBlock = Math.floor((currentPage - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  const pages = [];

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePrev = () => {
    const prevBlockStart = (currentBlock - 1) * blockSize + 1;
    if (prevBlockStart > 0) {
      onPageChange(prevBlockStart);
    }
  };

  const handleNext = () => {
    const nextBlockStart = (currentBlock + 1) * blockSize + 1;
    if (nextBlockStart <= totalPages) {
      onPageChange(nextBlockStart);
    }
  };

  return (
    <div className="w-full flex items-center gap-1">
      {startPage > 1 && (
        <button onClick={handlePrev} className="px-2.5 py-2">
          &lt; 이전
        </button>
      )}
      {pages?.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className="w-5 h-5 border rounded"
        >
          {page}
        </button>
      ))}
      {endPage < totalPages && (
        <button onClick={handleNext} className="px-2.5 py-2">
          다음 &gt;
        </button>
      )}
    </div>
  );
}
