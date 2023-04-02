import { notifications } from "@mantine/notifications";

class HTTPError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = "HTTP Error";
  }
}

/**
 * 异常处理程序
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const errorHandler = (error: {
  response: Response;
  data: { [key: string]: object };
}): object => {
  const { response, data } = error;
  console.log(data);
  if (data || data !== undefined) {
    return data;
  }
  return response;
};

const TIME_OUT_MS = 30000;

const getHeaders = () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  return headers;
};

declare interface ResponseModel {
  code: number;
  msg: string;
  data: any;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function request(
  url: string,
  method: string | undefined,
  data: Record<string, unknown> | undefined,
  headers: { [key: string]: string } | undefined = undefined
): Promise<ResponseModel> {
  let options: RequestInit | undefined = {
    method: (method ?? "GET").toUpperCase(),
    // mode: "cors",
    // credentials: "include",
  };
  if (options.method !== "GET") {
    options.body = JSON.stringify(data);
    options.headers = {
      "Content-Type": "application/json",
    };
  }
  if (headers) {
    options.headers = { ...options.headers, ...headers };
  }

  return fetch(url, options)
    .then((r) => r.json())
    .then((r) => {
      if (r.code != 200) {
        if (r.msg) {
          notifications.show({ title: r.msg, color: "red", message: r.msg });
          throw new HTTPError(r.msg);
        }
      }
      return r;
    });
}

async function GET(
  path: string,
  data: Record<string, unknown> | undefined = {}
): Promise<ResponseModel> {
  return request(path, "GET", data);
}

async function POST(
  path: string,
  data: Record<string, unknown> | undefined = {}
): Promise<ResponseModel> {
  return request(path, "POST", data);
}

function getAuthHeader(): { [key: string]: string } {
  let token = localStorage.getItem("token");
  if (token === undefined) {
    token = "";
  }
  token = `Bearer ${token}`;
  const headers = {
    Authorization: token,
  };
  return headers;
}

function getJsonHeader(): { [key: string]: string } {
  return {
    "Content-Type": "application/json",
  };
}

async function AUTHGET(
  path: string,
  data: Record<string, unknown> | undefined = {}
): Promise<ResponseModel> {
  const headers = getAuthHeader();
  return request(path, "GET", data, headers);
}

async function AUTHPOST(
  path: string,
  data: Record<string, unknown> | undefined = {}
): Promise<ResponseModel> {
  const headers = getAuthHeader();
  return request(path, "POST", data, headers);
}

export { GET, POST, AUTHGET, AUTHPOST };

export interface LoginResponse {
  user_id: number;
  identifier: string;
  email: string;
  createAt: number;
  token: string;
}

// Debug 环境下，如果使用内部的 重定向，会有问题
const API_URL = "http://127.0.0.1:5000";

export async function requestLogin(
  email: string,
  password: string
): Promise<LoginResponse> {
  const resp = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { ...getJsonHeader() },
    body: JSON.stringify({ email: email, password: password }),
  });
  const data = await resp.json();
  return data as LoginResponse;
}

export async function requestRegister(
  email: string,
  password: string
): Promise<any> {
  const url = `/api/auth/register`;
  return POST(url, { email, password }).then((r) => r.data);
}
