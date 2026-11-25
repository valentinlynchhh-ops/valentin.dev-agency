import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { absolute: "CRM · valentin.dev" },
  robots: { index: false, follow: false },
};

export default function AdminRaiz({ children }: { children: React.ReactNode }) {
  return <div className="ad">{children}</div>;
}
