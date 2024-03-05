import { DataGrid, GridColDef, getGridStringOperators } from "@mui/x-data-grid";
import { IResourceComponentsProps } from "@refinedev/core";
import {
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";
import { currencyFormatter } from "../../shared/currency-formatter";

const onlyContainsfilterOperators = getGridStringOperators().filter(({ value }) =>
  ['contains' ].includes(value),
);

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
        filterOperators: onlyContainsfilterOperators,
      },
      {
        field: "priceHistory",
        flex: 1,
        headerName: "Value",
        type: "number",
        minWidth: 100,
        filterable: false,
        valueGetter: (params) => {
          if (params.value) {
            return params.value[0].value;
          }
          return 0;
        },
        valueFormatter: (params) => currencyFormatter.format(params?.value),
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
