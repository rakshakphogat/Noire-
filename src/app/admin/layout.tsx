"use client";

import { AdminProvider } from "@/app/context/AdminContext";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProvider>{children}</AdminProvider>;
}
