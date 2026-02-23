"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      window.location.href = `/api/auth/confirm?token=${token}`;
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center space-y-3">
        <p className="text-gray-500">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <ConfirmContent />
    </Suspense>
  );
}
