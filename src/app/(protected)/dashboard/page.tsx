"use client";

import { Button } from "@/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageId = searchParams.get("pageId");

  const { data: emails, isFetching } = useSuspenseQuery({
    queryKey: ["emails", pageId],
    queryFn: async () => {
      const url = process.env.NEXT_PUBLIC_URL +`/api/gmail/${pageId ?? "0"}`
      const response = await fetch(url);
      return await response.json();
    },
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <div>
      <Button
        isLoading={isFetching}
        onClick={() => {
          router.push(
            pathname +
              "?" +
              createQueryString("pageId", emails?.meta?.nextPageToken)
          );
        }}
      >
        get next emails
      </Button>

      <div className="grid grid-cols-4">
        {emails?.data?.map((email, index) => {
          const headers = email?.data?.payload?.headers;

          const subject = headers?.find(
            (header: { name: string }) => header.name === "Subject"
          );
          const from = headers?.find(
            (header: { name: string }) => header.name === "From"
          );
          const receivedAt = headers?.find(
            (header: { name: string }) => header.name === "Date"
          );

          return (
            <div
              key={index}
              className="p-2 flex flex-col gap-1 border border-dashed border-neutral-600"
            >
              <span className="text-neutal-400">{from?.value}</span>
              <span className="text-xs text-neutral-500">
                {receivedAt?.value}{" "}
              </span>
              <p className="text-sm text-neutral-500">{subject?.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
