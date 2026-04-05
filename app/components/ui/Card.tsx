"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`premium-surface rounded-[1.5rem] p-5 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}