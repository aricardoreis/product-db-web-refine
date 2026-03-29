import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
  const { dataGridProps, setFilters } = useDataGrid({});
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = (value: string) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFilters([{ field: "name", operator: "contains", value: value || undefined }]);
    }, 400);
  };

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
        filterable: false,
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
            const sorted = [...value].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            );
            return sorted[0].value;
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
      <TextField
        placeholder="Search by name..."
        size="small"
        sx={{ mb: 2 }}
        onChange={(e) => handleSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};
