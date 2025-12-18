"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;

      if (!token && !userRaw) return; // not logged in

      const user = userRaw ? JSON.parse(userRaw) : null;
      const role = user?.role || null;

      if (role === "ADMIN") {
        router.replace("/admin");
      } else if (role === "MANAGER") {
        router.replace("/manager");
      } else if (role === "EMPLOYEE") {
        router.replace("/employee");
      }
    } catch (e) {
      // ignore parsing errors and do nothing
    }
  }, [router]);

  return null;
}
