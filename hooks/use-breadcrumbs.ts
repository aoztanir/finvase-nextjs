"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useBreadcrumbStore } from "@/lib/stores/breadcrumb-store";

export function useBreadcrumbs() {
  const pathname = usePathname();
  const { updateBreadcrumbsFromPath } = useBreadcrumbStore();

  useEffect(() => {
    updateBreadcrumbsFromPath(pathname);
  }, [pathname, updateBreadcrumbsFromPath]);
}