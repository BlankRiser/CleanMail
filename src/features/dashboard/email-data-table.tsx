"use client";

import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { getEmailTableColumns } from "./email-table-columns";
import {
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { EmailResponse } from "@/schemas/emails";

type EmailDataTableProps = {
  emails: EmailResponse;
};

export const EmailDataTable: React.FC<EmailDataTableProps> = ({ emails }) => {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const columns = React.useMemo(() => getEmailTableColumns(), []);

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    data: emails.data,
    columns,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getSelectedRows = () => {
    return table.getSelectedRowModel().flatRows.map((row) => row.original);
  };

  return (
    <div className="">
      <DataTable table={table} data={emails.data} columns={columns} />
    </div>
  );
};
