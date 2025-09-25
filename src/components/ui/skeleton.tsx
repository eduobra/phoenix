import React from "react";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-neutral-700 ${className}`} {...props} />;
}

export default Skeleton;



