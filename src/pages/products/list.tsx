import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps } from "@refinedev/core";
import {
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";

export const ProductList: React.FC<IResourceComponentsProps> = () => {
  const { dataGridProps } = useDataGrid({});

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        minWidth: 50,
      },
      {
        field: "name",
        flex: 1,
        headerName: "Name",
        minWidth: 200,
      },
      {
        field: "priceHistory",
        flex: 1,
        headerName: "Value",
        type: "number",
        minWidth: 100,
        valueGetter: (params) => {
          if (params.value) {
            return params.value[0].value;
          }
          return 0;
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
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
