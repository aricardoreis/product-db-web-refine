import { useShow, IResourceComponentsProps } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { Typography, Stack } from "@mui/material";
import { currencyFormatter } from "../../shared/currency-formatter";
import { formatDate } from "../../shared/date-formatter";

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
        {record?.products?.map((item) => (
          <Typography variant="body1" key={item.id}>
            {item.name} | {item.type} | {item.amount} |{" "}
            {currencyFormatter.format(item.value)}
          </Typography>
        ))}
        <Typography variant="body1" fontWeight="bold">
          Total
        </Typography>
        <TextField value={currencyFormatter.format(record?.total ?? 0)} />
      </Stack>
    </Show>
  );
};
