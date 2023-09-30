import React from "react";
import { twMerge } from "tailwind-merge";

interface OpsProps {
  children?: React.ReactNode;
  className?: string;
  title: string;
}
const Ops: React.FC<OpsProps> = ({ children, className, title }) => {
  return (
    <div
      className={twMerge(
        `bg-transparent border-2 border-neutral-900 border-b-black rounded-md h-fit w-full text-center`,
        className
      )}
    >
      <h1 className="text-2xl font-semibold text-neutral-600 text-left p-2 w-fit">
        {title} :
      </h1>
      {children}
    </div>
  );
};

export default Ops;
