import { useShow, IResourceComponentsProps } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { Typography, Stack, Grid, Box } from "@mui/material";
import { currencyFormatter } from "../../shared/currency-formatter";
import { formatDate } from "../../shared/date-formatter";

const ProductItem = (item: any) => {
  return (
    <Grid container justifyContent="space-between" key={item.id}>
      <Grid item xs={6}>
        {item.name}
      </Grid>
      <Grid item xs>
        {item.type}
      </Grid>
      <Grid item xs>
        {item.amount}
      </Grid>
      <Grid item xs>
        {currencyFormatter.format(item.value)}
      </Grid>
    </Grid>
  );
};

export const SaleShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          Id
        </Typography>
        <TextField value={record?.id ?? ""} />
        <Typography variant="body1" fontWeight="bold">
          Store
        </Typography>
        <TextField value={record?.store?.name} />
        <Typography variant="body1" fontWeight="bold">
          Date
        </Typography>
        <TextField value={formatDate(record?.date)} />
        <Typography variant="body1" fontWeight="bold">
          Products
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          {record?.products?.map((item: any) => (
            <ProductItem key={item.id} {...item} />
          ))}
        </Box>
        <Typography variant="body1" fontWeight="bold">
          Total
        </Typography>
        <TextField value={currencyFormatter.format(record?.total ?? 0)} />
      </Stack>
    </Show>
  );
};