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

  const getSelectedRows = () => {
    return table.getSelectedRowModel().flatRows.map((row) => row.original);
  };

  return (
    <div>
      <DataTable table={table} data={emails.data} columns={columns} />
    </div>
  );
};
