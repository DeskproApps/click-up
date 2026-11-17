import { BASE_URL, placeholders } from "../../constants";
import { ClickUpError, isAuthError } from "./ClickUpError";
import { notifyAuthError } from "./authErrorEvents";
import { getQueryParams } from "../../utils";
import { proxyFetch } from "@deskpro/app-sdk";
import isEmpty from "lodash/isEmpty";
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
      // ClickUp expects OAuth access tokens as a Bearer token
      "Authorization": `Bearer ${placeholders.TOKEN}`,
      ...customHeaders,
    },
  };

  if (data instanceof FormData) {
    options.body = data;
    options.headers = {
      "Content-Type": "multipart/form-data",
      ...options.headers,
    };
  } else if (!isEmpty(data)) {
    options.body = JSON.stringify(data);
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  }

  const res = await dpFetch(requestUrl, options);

  if (res.status < 200 || res.status > 399) {
    // ClickUp errors are usually JSON, but its gateway answers some (e.g. an unknown
    // route) with plain text such as "404 page not found"
    const body = await res.text();
    let data;

    try {
      data = JSON.parse(body);
    } catch (e) {
      data = { err: body.trim() || res.statusText, ECODE: "" };
    }

    const error = new ClickUpError({ status: res.status, data });

    if (isAuthError(error)) {
      notifyAuthError();
    }

    throw error;
  }

  try {
    return await res.json();
  } catch (e) {
    return {};
  }
};

export { baseRequest };
