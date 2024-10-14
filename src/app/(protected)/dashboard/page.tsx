"use client";

import { useMutation } from "@tanstack/react-query";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  const mutation = useMutation({
    mutationFn: async () => {
    const response = await fetch("/api/gmail");
    const data = await response.json();
    return data;
      
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <div>
      <button
        onClick={() => {
          mutation.mutate();
        }}
      >
        get emails
      </button>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}