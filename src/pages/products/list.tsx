import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps } from "@refinedev/core";
import {
  List,
  EditButton,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";
import { currencyFormatter } from "../../shared/currency-formatter";

export const ProductList: React.FC<IResourceComponentsProps> = () => {
  const { dataGridProps } = useDataGrid({});

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        minWidth: 50,
        filterable: false,
      },
      {
        field: "name",
        flex: 1,
        headerName: "Name",
        minWidth: 200,
        filterable: true,
      },
      {
        field: "priceHistory",
        flex: 1,
        headerName: "Value",
        type: "number",
        minWidth: 100,
        filterable: false,
        sortable: false,
        valueGetter: (value: any[]) => {
          if (value && value.length > 0) {
            return value[0].value;
          }
          return 0;
        },
        valueFormatter: (value: number) => currencyFormatter.format(value),
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
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
