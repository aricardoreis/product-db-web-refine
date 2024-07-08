import axiosInstance from "../shared/network";

export const createSaleFromInvoice = async (url: string) => {
  const response = await axiosInstance.post("/sales", {
    url,
  });
  return response;
};
