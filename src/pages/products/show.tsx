import { useShow, IResourceComponentsProps } from "@refinedev/core";
import {
  Show,
  NumberField,
  TextFieldComponent as TextField,
  BooleanField,
} from "@refinedev/mui";
import { Typography, Stack, Box, Grid } from "@mui/material";
import { currencyFormatter } from "../../shared/currency-formatter";
import { formatDate } from "../../shared/date-formatter";

export const ProductShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          Id
        </Typography>
        <NumberField value={record?.id ?? ""} />
        <Typography variant="body1" fontWeight="bold">
          Name
        </Typography>
        <TextField value={record?.name} />
        <Typography variant="body1" fontWeight="bold">
          Code
        </Typography>
        <TextField value={record?.code ?? ""} />
        <Typography variant="body1" fontWeight="bold">
          Amount
        </Typography>
        <NumberField value={record?.amount ?? ""} />
        <Typography variant="body1" fontWeight="bold">
          Type
        </Typography>
        <TextField value={record?.type} />
        <Typography variant="body1" fontWeight="bold">
          Is Ean
        </Typography>
        <BooleanField value={record?.isEan} />
        <Typography variant="body1" fontWeight="bold">
          Price History
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          {record?.priceHistory?.map((item) => (
            <Grid container key={item.id} xs={6} lg={4} justifyContent="space-between">
              <Grid item xs>
                {formatDate(item.date)}
              </Grid>
              <Grid item xs>
                {currencyFormatter.format(item.value)}
              </Grid>
            </Grid>
          ))}
        </Box>
      </Stack>
    </Show>
  );
};
