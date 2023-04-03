import CN from "./cn";

export type { LocaleType } from "./cn";

export const AllLangs = ["cn"] as const;
type Lang = typeof AllLangs[number];

const LANG_KEY = "lang";

function getItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* empty */
  }
}

function getLanguage() {
  try {
    return navigator.language.toLowerCase();
  } catch {
    return "cn";
  }
}

export function getLang(): Lang {
  const savedLang = getItem(LANG_KEY);

  if (AllLangs.includes((savedLang ?? "") as Lang)) {
    return savedLang as Lang;
  }

  const lang = getLanguage();

  // if (lang.includes("zh") || lang.includes("cn")) {
  // }
  return "cn";
}

export function changeLang(lang: Lang) {
  setItem(LANG_KEY, lang);
  // eslint-disable-next-line no-restricted-globals
  location.reload();
}

export default { cn: CN }[getLang()];
