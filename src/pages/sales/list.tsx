import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps } from "@refinedev/core";
import { List, ShowButton, useDataGrid } from "@refinedev/mui";
import React from "react";

export const SaleList: React.FC<IResourceComponentsProps> = () => {
  const { dataGridProps } = useDataGrid({});

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        minWidth: 100,
        filterable: false,
      },
      {
        field: "date",
        headerName: "Date",
        minWidth: 100,
        filterable: false,
        valueFormatter: (params) =>
          new Intl.DateTimeFormat("pt-BR").format(new Date(params?.value)),
      },
      {
        field: "total",
        headerName: "Total",
        type: "number",
        minWidth: 100,
        filterable: false,
        valueFormatter: (params) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(params?.value),
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <ShowButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};
