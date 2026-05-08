import {
  API_BASE_URL,
  AUTH_TOKEN_EVENT,
  AUTH_TOKEN_KEY,
} from "@/app/constants/common";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

type QueryParams = Record<string, QueryValue>;

type ApiRequestOptions = Omit<RequestInit, "body" | "method"> & {
  data?: unknown;
  params?: QueryParams;
  token?: string;
  withAuth?: boolean;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const isBrowser = typeof window !== "undefined";

const buildUrl = (endpoint: string, params?: QueryParams) => {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`);

  if (!params) {
    return url.toString();
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        url.searchParams.append(key, String(item));
      });
      return;
    }

    url.searchParams.append(key, String(value));
  });

  return url.toString();
};

const getStoredToken = () => {
  if (!isBrowser) {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));
};

export const clearAuthToken = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));
};

export const getAuthToken = () => getStoredToken();

const isBodyInit = (value: unknown): value is BodyInit => {
  return (
    typeof value === "string" ||
    value instanceof Blob ||
    value instanceof FormData ||
    value instanceof URLSearchParams ||
    value instanceof ReadableStream ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value)
  );
};

const createHeaders = (
  headers: HeadersInit | undefined,
  data: ApiRequestOptions["data"],
  token: string | null,
) => {
  const requestHeaders = new Headers(headers);

  if (
    data !== undefined &&
    data !== null &&
    !isBodyInit(data) &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  return requestHeaders;
};

const parseResponse = async (response: Response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const getErrorMessage = (data: unknown, fallbackMessage: string) => {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string" &&
    data.message.trim()
  ) {
    return data.message;
  }

  return fallbackMessage;
};

export const apiRequest = async <TResponse = unknown>(
  method: HttpMethod,
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> => {
  const { data, params, token, withAuth = false, headers, ...restOptions } = options;
  const authToken = token || (withAuth ? getStoredToken() : null);
  const requestHeaders = createHeaders(headers, data, authToken);

  const response = await fetch(buildUrl(endpoint, params), {
    ...restOptions,
    method,
    headers: requestHeaders,
    body:
      data === undefined || data === null
        ? undefined
        : isBodyInit(data)
          ? data
          : JSON.stringify(data),
  });

  const responseData = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(responseData, "Something went wrong"),
      response.status,
      responseData,
    );
  }

  return responseData as TResponse;
};

export const get = <TResponse = unknown>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, "data">,
) => apiRequest<TResponse>("GET", endpoint, options);

export const post = <TResponse = unknown, TBody = unknown>(
  endpoint: string,
  data?: TBody,
  options?: Omit<ApiRequestOptions, "data">,
) => apiRequest<TResponse>("POST", endpoint, { ...options, data });

export const put = <TResponse = unknown, TBody = unknown>(
  endpoint: string,
  data?: TBody,
  options?: Omit<ApiRequestOptions, "data">,
) => apiRequest<TResponse>("PUT", endpoint, { ...options, data });

export const deleteRequest = <TResponse = unknown>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, "data">,
) => apiRequest<TResponse>("DELETE", endpoint, options);

export const apiClient = {
  get,
  post,
  put,
  delete: deleteRequest,
};

export type {
  ApiRequestOptions,
  QueryParams,
};
