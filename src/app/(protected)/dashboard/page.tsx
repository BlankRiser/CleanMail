"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/env.mjs";
import { EmailDataTable } from "@/features/dashboard/email-data-table";
import { useQuery } from "@tanstack/react-query";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageId = searchParams.get("pageId");

  const { data: emails, isPending , isFetching} = useQuery({
    queryKey: ["emails", pageId],
    queryFn: async () => {
      const url = env.NEXT_PUBLIC_URL + `/api/gmail/${pageId ?? "0"}`;
      const response = await fetch(url);
      return await response.json();
    },
    placeholderData: (prev) => prev
  });

  console.log("emails", emails);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  if(isPending){
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <EmailDataTable emails={emails} />
      </div>
      <Button
        onClick={() => {
          router.push(
            pathname +
              "?" +
              createQueryString("pageId", emails?.meta?.nextPageToken)
          );
        }}
      >
        {isFetching ? "Loading" : "get next emails"}
      </Button>
    </div>
  );
}
