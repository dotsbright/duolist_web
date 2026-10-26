"use client";

import { PropsWithChildren } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export default function BodyChrome({ children }: PropsWithChildren) {
  return (
    <div className="flex-1 flex flex-col">
      <SiteHeader />
      <main className="app-container py-6 grow">{children}</main>
      <SiteFooter />
    </div>
  );
}
