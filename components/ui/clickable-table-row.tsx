"use client";

import { useRouter } from "next/navigation";
import { TableRow } from "@/components/ui/table";
import { ReactNode, MouseEvent } from "react";

interface ClickableTableRowProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function ClickableTableRow({ href, children, className = "" }: ClickableTableRowProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLTableRowElement>) => {
    // Don't navigate if clicking on a link or button
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) {
      return;
    }
    router.push(href);
  };

  return (
    <TableRow
      className={`cursor-pointer hover:bg-muted/50 ${className}`}
      onClick={handleClick}
    >
      {children}
    </TableRow>
  );
}

