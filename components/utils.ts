import { showNotification } from "@mantine/notifications";
import Locale from "./locales";

export function trimTopic(topic: string) {
  const s = topic.split("");
  let lastChar = s.at(-1); // 获取 s 的最后一个字符
  const pattern = /[，。！？、,.!?]/; // 定义匹配中文和英文标点符号的正则表达式
  while (lastChar && pattern.test(lastChar!)) {
    s.pop();
    lastChar = s.at(-1);
  }

  return s.join("");
}

export function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showNotification({
        title: Locale.Copy.Success,
        message: text,
        color: "green",
      });
    })
    .catch((err) => {
      showNotification({
        title: Locale.Copy.Failed,
        message: err,
        color: "red",
      });
    });
}

export function downloadAs(text: string, filename: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function isIOS() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

export function selectOrCopy(el: HTMLElement, content: string) {
  const currentSelection = window.getSelection();

  if (currentSelection?.type === "Range") {
    return false;
  }

  copyToClipboard(content);

  return true;
}

export function queryMeta(key: string, defaultValue?: string): string {
  let ret: string;
  if (document) {
    const meta = document.head.querySelector(
      `meta[name='${key}']`
    ) as HTMLMetaElement;
    ret = meta?.content ?? "";
  } else {
    ret = defaultValue ?? "";
  }

  return ret;
}

let currentId: string;
export function getCurrentCommitId() {
  if (currentId) {
    return currentId;
  }

  currentId = queryMeta("version");

  return currentId;
}

export const regexPasswordValid = (password: string): boolean => {
  return password.length >= 3;
  const regex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/;
  return regex.test(password);
};

export const regexEmailValid = (email: string): boolean => {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};
