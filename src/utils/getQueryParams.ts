import { createSearchParams } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import type { ParamKeyValuePair } from "react-router-dom";
import type { Dict, RequestParams } from "../types";

const getQueryParams = (data?: RequestParams["queryParams"]): string => {
  if (isEmpty(data)) {
    return "";
  }

  if (isString(data)) {
    return data;
  }

  if (Array.isArray(data)) {
    return `${createSearchParams(data)}`;
  }

  if (isPlainObject(data)) {
    const parsedQueryParams = Object.keys(data as Dict<string>)
      .map<ParamKeyValuePair>((key) => ([key, (data as Dict<string>)[key]]));
    return `${createSearchParams(parsedQueryParams)}`;
  }

  return "";
};

export { getQueryParams };
