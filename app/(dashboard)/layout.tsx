// app/(dashboard)/layout.tsx
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Aquí irá el sidebar y navbar del dashboard */}
        {children}
      </div>
    </AuthGuard>
  );
}