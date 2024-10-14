"use client";

import { signIn, signOut } from "next-auth/react";
import React from "react";

export const Navbar = () => {
  return (
    <nav className="flex justify-between items-center max-w-7xl mx-auto gap-2 w-full">
      <span>Gmail Cleanser</span>
      <div className="flex items-center gap-4 ">
        <button onClick={() => signIn("google", { redirectTo: "/dashboard" })}>
          Sign In
        </button>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    </nav>
  );
};
