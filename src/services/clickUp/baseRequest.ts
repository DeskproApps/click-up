import isEmpty from "lodash/isEmpty";
import { proxyFetch } from "@deskpro/app-sdk";
import { BASE_URL, placeholders } from "../../constants";
import { getQueryParams } from "../../utils";
import { ClickUpError } from "./ClickUpError";
import type { Request } from "../../types";

const baseRequest: Request = async (client, {
  url,
  data = {},
  method = "GET",
  queryParams = {},
  headers: customHeaders,
}) => {
  const dpFetch = await proxyFetch(client);

  const baseUrl = `${BASE_URL}${url}`;
  const params = getQueryParams(queryParams);

  const requestUrl = `${baseUrl}?${params}`;
  const options: RequestInit = {
    method,
    headers: {
      "Authorization": placeholders.TOKEN,
      ...customHeaders,
    },
  };

  if (data instanceof FormData) {
    options.body = data;
  } else if (!isEmpty(data)) {
    options.body = JSON.stringify(data);
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  }

  const res = await dpFetch(requestUrl, options);

  if (res.status < 200 || res.status > 399) {
    throw new ClickUpError({
      status: res.status,
      data: await res.json(),
    });
  }

  try {
    return await res.json();
  } catch (e) {
    return {};
  }
};

export { baseRequest };
