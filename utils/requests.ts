import { notifications } from "@mantine/notifications";
import { Message } from "./store";

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

declare interface ResponseModel {
  code: number;
  msg: string;
  data: any;
}

// eslint-disable-next-line @typescript-eslint/ban-types
async function request(
  url: string,
  options: RequestInit
): Promise<ResponseModel> {
  if (url.startsWith("/")) {
    url = `${API_URL}${url}`;
  }
  const resp = await fetch(url, options);
  const r = await resp.json();
  if (r.code != 200) {
    if (r.msg) {
      notifications.show({ title: r.msg, color: "red", message: r.msg });
    }
  }
  return r;
}

async function GET(path: string): Promise<ResponseModel> {
  return request(path, { method: "GET", headers: getJsonHeader() });
}

async function POST(
  path: string,
  data: Record<string, unknown> | undefined = {}
): Promise<ResponseModel> {
  return request(path, {
    method: "POST",
    body: JSON.stringify(data),
    headers: getJsonHeader(),
  });
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

async function AUTHGET(path: string): Promise<ResponseModel> {
  const headers = getAuthHeader();
  return request(path, {
    method: "GET",
    headers: { ...getJsonHeader(), ...getAuthHeader() },
  });
}

async function AUTHPOST(
  path: string,
  data: Record<string, unknown> | undefined = {}
): Promise<ResponseModel> {
  const headers = getAuthHeader();
  return request(path, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { ...getJsonHeader(), ...getAuthHeader() },
  });
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
  const resp = await POST("/auth/login/", { email, password });
  const data = resp.data;
  return data as LoginResponse;
}

export async function requestRegister(
  email: string,
  password: string
): Promise<any> {
  const path = `/auth/register`;
  const resp = await POST(path, { email, password });
  const data = resp.data;
  return data;
}

export async function requestLogout(): Promise<any> {
  const path = `/auth/logout`;
  const resp = await AUTHPOST(path);
  const data = resp.data;
  return data;
}

// chat prompt

interface ChatRequest {
  messages: Message[];
}

const _makeChatRequestParam = (
  messages: Message[],
  options?: {
    filterBot?: boolean;
    stream?: boolean;
  }
): ChatRequest => {
  let sendMessage = messages.filter((v) => ({
    role: v.role,
    content: v.content,
  }));
  if (options?.filterBot) {
    sendMessage = sendMessage.filter((v) => v.role !== "assistant");
  }
  return {
    messages: sendMessage,
  };
};

export async function requestChat(
  messages: Message[],
  conversation_idf: string
) {
  const req = _makeChatRequestParam(messages, { filterBot: true });
  const path = "/gpt/competion/";
  const resp = await AUTHPOST(path, { ...req, conversation: conversation_idf });
  const data = resp.data;
  return data;
}
