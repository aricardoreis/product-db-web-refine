import { DataProvider } from "@refinedev/core";
import axios from "axios";

/**
 * Check out the Data Provider documentation for detailed information
 * https://refine.dev/docs/api-reference/core/providers/data-provider/
 **/

// const API_URL = "https://app.rolimreis.com";
const API_URL = "http://localhost:3000";

export const productDbDataProvider = (): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${API_URL}/${resource}`;

    console.log("getList", {
      resource,
      pagination,
      filters,
      sorters,
      meta,
    });

    const response = await axios.get(url, {
      params: {
        limit: pagination?.pageSize,
        page: pagination?.current,
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

    // TODO: send request to the API
    // const response = await httpClient.post(url, {});

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

    const result = await axios.get(`${API_URL}/${resource}/${id}`);
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
    return API_URL;
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
