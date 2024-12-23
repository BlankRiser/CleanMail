import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { env } from "@/env.mjs";
import { EmailMessageData } from "@/schemas/emails";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";

export function getEmailTableColumns(): ColumnDef<EmailMessageData>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "subject",
      header: () => <span className="capitalize">Subject</span>,
      cell: ({ row }) => {
        const subjectHeader = row.original?.data?.payload?.headers?.find(
          (header: { name: string }) => header.name === "Subject"
        );
        return <span className="capitalize">{subjectHeader?.value}</span>;
      },
    },
    {
      id: "from",
      header: () => <span className="capitalize">From</span>,
      cell: ({ row }) => {
        const fromHeader = row.original?.data?.payload?.headers?.find(
          (header: { name: string }) => header.name === "From"
        );
        return <span className="capitalize">{fromHeader?.value}</span>;
      },
    },
    {
      id: "date",
      header: () => <span className="capitalize">Date</span>,
      cell: ({ row }) => {
        const dateHeader = row.original?.data?.payload?.headers?.find(
          (header: { name: string }) => header.name === "Date"
        );
        return <span className="capitalize">{dateHeader?.value}</span>;
      },
    },
    {
      id: "view",
      header: () => <span className="capitalize">View</span>,
      cell: ({ row }) => {
        return (
          <DeleteMail
            emailId={row.original?.data?.id}
            snippet={row.original?.data?.snippet}
          />
        );
      },
    },
  ];
}

const DeleteMail = ({
  emailId,
  snippet,
}: {
  emailId: string;
  snippet: string;
}) => {
  const mutation = useMutation({
    mutationFn: async () => {
      const url = env.NEXT_PUBLIC_URL + `/api/gmail/messages/${emailId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("delete res: ", data);
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <EyeOpenIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[768px]">
        <DialogHeader>
          <DialogTitle>Metadetails</DialogTitle>
          <DialogDescription>{`${snippet}...`}</DialogDescription>
        </DialogHeader>
        <div></div>
        <DialogFooter>
          <Button
            onClick={() => {
              mutation.mutate();
            }}
            variant="destructive"
          >
            Delete Mail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
