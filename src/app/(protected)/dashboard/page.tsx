"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/env.mjs";
import { EmailDataTable } from "@/features/dashboard/email-data-table";
import { useEmailStore } from "@/providers/email-store-provider";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

export default function Dashboard() {
  const [currentPageIdQuery, setCurrentPageIdQuery] = useQueryState("pageId");
  const { addPageId, previousPageId, nextPageId, setCurrentPageId } =
    useEmailStore((state) => state);

  const {
    data: emails,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["emails", currentPageIdQuery],
    queryFn: async () => {
      const url = env.NEXT_PUBLIC_URL + `/api/gmail/${currentPageIdQuery ?? "0"}`;
      const response = await fetch(url);
      return await response.json();
    },
    placeholderData: (prev) => prev,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  console.log(previousPageId, nextPageId);

  return (
    <section className="space-y-4">
    <EmailDataTable emails={emails} />
     
      <div className="flex justify-end items-center gap-2">
        <Button
          variant="outline"
          disabled={!previousPageId}
          onClick={() => {
            console.log("previousPageId", previousPageId);
            if (previousPageId) {
              setCurrentPageIdQuery(previousPageId);
              setCurrentPageId(previousPageId);
            }
          }}
        >
          {isFetching ? "Loading" : "Previous"}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (!nextPageId) {

              setCurrentPageIdQuery(emails?.meta?.nextPageToken);
              addPageId(emails?.meta?.nextPageToken);

              console.log(
                emails?.meta?.nextPageToken
              )
            } else {
              setCurrentPageIdQuery(nextPageId);
              setCurrentPageId(emails?.meta?.nextPageToken);
            }
          }}
        >
          {isFetching ? "Loading" : "Next"}
        </Button>
      </div>
    </section>
  );
}
