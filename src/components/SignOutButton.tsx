"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="ef-btn ef-btn-secondary !py-2 !px-3 !text-[12px]"
    >
      Sign out
    </button>
  );
}
