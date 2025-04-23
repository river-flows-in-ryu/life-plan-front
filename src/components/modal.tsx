import React, { useEffect, useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: Props) {
  const backdropRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [isOpen]);

  const handleClickBackdrop = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (backdropRef.current === event.target) {
      onClose();
    }
  };

  return (
    <>
      {isOpen ? (
        <div
          className="w-full h-screen fixed top-0 left-0 bg-black/80 bg-opacity-50 z-20 flex justify-center items-center"
          onClick={handleClickBackdrop}
          ref={backdropRef}
        >
          {children}
        </div>
      ) : null}
    </>
  );
}
