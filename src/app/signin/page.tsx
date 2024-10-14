"use client"
import { signIn, signOut } from "next-auth/react"

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-2">
      
      <button onClick={() => signIn("google", { redirectTo: "/dashboard" })}>
      Sign In
    </button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}