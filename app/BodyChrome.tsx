"use client";

import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export default function BodyChrome({ children }: PropsWithChildren) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Full screen for admin: no site header/footer
    return <>{children}</>;
  }

  return (
    <div className="flex-1 flex flex-col">
      <SiteHeader />
      <main className="app-container py-6 grow">{children}</main>
      <SiteFooter />
    </div>
  );
}
