import axios from "axios";

export const createSaleFromInvoice = async (url: string) => {
  const endpointUrl = `${import.meta.env.VITE_API_URL}/sales`;
  console.log("createSaleFromInvoice", endpointUrl, url);
  const response = await axios.post(endpointUrl, {
    url,
  });
  return response;
};
