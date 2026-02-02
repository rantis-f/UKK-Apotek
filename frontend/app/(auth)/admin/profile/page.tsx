"use client";

import ProfileDetail from "@/components/profile/ProfileDetail";

export default function AdminProfilePage() {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profil Staff</h1>
        <p className="text-sm text-gray-500">Kelola informasi akun internal Anda di sini.</p>
      </div>
      <ProfileDetail />
    </div>
  );
}