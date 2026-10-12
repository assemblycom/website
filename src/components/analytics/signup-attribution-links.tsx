"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { observeSignupLinks } from "@/lib/signup-attribution";

function SignupAttributionLinksInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => observeSignupLinks(document), [pathname, searchParams]);
  return null;
}

export function SignupAttributionLinks() {
  return <Suspense><SignupAttributionLinksInner /></Suspense>;
}
