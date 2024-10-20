"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="flex justify-between items-center gap-2 w-full py-2">
      <Link href="/" className="font-mono font-medium  tracking-wider">
        Gmail Cleanser
      </Link>
      <div className="flex items-center gap-4 ">
        {!session ? (
          <Button
          variant={"link"}
            onClick={() => signIn("google", { redirectTo: "/dashboard" })}
          >
            Sign In
          </Button>
        ) : (
          <Button onClick={() => signOut()}>Sign Out</Button>
        )}
      </div>
    </nav>
  );
};
