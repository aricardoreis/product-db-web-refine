import { CrudSort, DataProvider } from "@refinedev/core";
import axios from "axios";
import { ACCESS_TOKEN_KEY } from "../shared/constants";

/**
 * Check out the Data Provider documentation for detailed information
 * https://refine.dev/docs/api-reference/core/providers/data-provider/
 **/

console.log(import.meta.env.VITE_API_URL);
if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL is not set");
}
const apiUrl: string = import.meta.env.VITE_API_URL;
const getAxiosConfig = () => {
  return {
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
    },
  };
};

export const productDbDataProvider = (): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    console.log("getList", {
      resource,
      pagination,
      filters,
      sorters,
      meta,
    });

    const keyword = filters?.find((filter: any) => {
      return filter.field === "name";
    })?.value;

    const sortField = sorters?.map((sorter: CrudSort) => {
      return `${sorter.field}:${sorter.order}`;
    });

    await axios.get(`/${resource}`, {
      ...getAxiosConfig(),
      params: {
        limit: pagination?.pageSize,
        page: pagination?.current,
        keyword: keyword,
        sort: sortField?.length ? sortField[0] : undefined,
      },
    });

    const response = await axios.get(`/${resource}`, {
      ...getAxiosConfig(),
      params: {
        limit: pagination?.pageSize,
        page: pagination?.current,
        keyword: keyword,
        sort: sortField?.length ? sortField[0] : undefined,
      },
    });

    if (response.status === 200) {
      return {
        data: response.data.result,
        total: response.data.total,
      };
    }

    return {
      data: [],
      total: 0,
    };
  },

  getMany: async ({ resource, ids, meta }) => {
    console.log("getMany", {
      resource,
      ids,
      meta,
    });

    // TODO: send request to the API
    // const response = await httpClient.get(url, {});

    return {
      data: [],
    };
  },

  create: async ({ resource, variables, meta }) => {
    console.log("create", {
      resource,
      variables,
      meta,
    });

    return {
      data: {} as any,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    console.log("update", {
      resource,
      id,
      variables,
      meta,
    });

    const response = await axios.patch(
      `/${resource}/${id}`,
      {
        ...variables,
      },
      getAxiosConfig()
    );

    if (response.status === 200) {
      return {
        data: response.data.result,
      };
    }

    return {
      data: {} as any,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    console.log("getOne", {
      resource,
      id,
      meta,
    });

    const result = await axios.get(`/${resource}/${id}`, getAxiosConfig());
    if (result.status === 200) {
      return {
        data: result.data.result,
      };
    } else
      return {
        data: {} as any,
      };
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    console.log("deleteOne", {
      resource,
      id,
      variables,
      meta,
    });

    // TODO: send request to the API
    // const response = await httpClient.post(url, {});

    return {
      data: {} as any,
    };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
    meta,
  }) => {
    console.log("custom", {
      url,
      method,
      filters,
      sorters,
      payload,
      query,
      headers,
      meta,
    });

    // TODO: send request to the API
    // const requestMethod = meta.method
    // const response = await httpClient[requestMethod](url, {});

    return {} as any;
  },
});
