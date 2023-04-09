const cn = {
  WIP: "该功能仍在开发中……",
  Error: {
    Unauthorized: "现在是未授权状态，请在设置页填写授权码。",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} 条对话`,
  },
  Chat: {
    SubTitle: (count: number) => `与 ChatGPT 的 ${count} 条对话`,
    Actions: {
      ChatList: "查看消息列表",
      CompressedHistory: "查看压缩后的历史 Prompt",
      Export: "导出聊天记录",
      Copy: "复制",
      Stop: "停止",
      Retry: "重试",
    },
    Typing: "正在输入…",
    Input: (submitKey: string) => {
      let inputHints = `输入消息，${submitKey} 发送`;
      if (submitKey === "Enter") {
        inputHints += "，Shift + Enter 换行";
      }
      return inputHints;
    },
    Send: "发送",
    Delete: {
      CleanAll: "清空聊天记录",
      CleanAllConfirm: "确认清空聊天记录？",
    },
  },
  Export: {
    Title: "导出聊天记录为 Markdown",
    Copy: "全部复制",
    Download: "下载文件",
  },
  Memory: {
    Title: "上下文记忆 Prompt",
    EmptyContent: "尚未记忆",
    Copy: "全部复制",
  },
  Home: {
    NewChat: "新的聊天",
    DeleteChat: "确认删除选中的对话？",
  },
  Settings: {
    Title: "设置",
    SubTitle: "设置选项",
    Email: {
      Title: "邮箱",
      SubTitle: "用于接收通知",
      NoEmail: "未设置邮箱",
    },
    Actions: {
      ClearAll: "清除所有数据",
      ResetAll: "重置所有选项",
      Close: "关闭",
    },
    Lang: {
      Name: "Language",
      Options: {
        cn: "简体中文",
      },
    },
    Avatar: "头像",
    FontSize: {
      Title: "字体大小",
      SubTitle: "聊天内容的字体大小",
    },
    Update: {
      Version: (x: string) => `当前版本：${x}`,
      IsLatest: "已是最新版本",
      CheckUpdate: "检查更新",
      IsChecking: "正在检查更新...",
      FoundUpdate: (x: string) => `发现新版本：${x}`,
      GoToUpdate: "前往更新",
    },
    SendKey: "发送键",
    Theme: "主题",
    TightBorder: "紧凑边框",
    Prompt: {
      Disable: {
        Title: "禁用提示词自动补全",
        SubTitle: "禁用后将无法自动根据输入补全",
      },
      List: "自定义提示词列表",
      ListCount: (builtin: number, custom: number) =>
        `内置 ${builtin} 条，用户定义 ${custom} 条`,
      Edit: "编辑",
    },
    HistoryCount: {
      Title: "附带历史消息数",
      SubTitle: "每次请求携带的历史消息数",
    },
    CompressThreshold: {
      Title: "历史消息长度压缩阈值",
      SubTitle: "当未压缩的历史消息超过该值时，将进行压缩",
    },
  },
  Store: {
    DefaultTopic: "新的聊天",
    BotHello: "有什么可以帮你的吗",
    Error: "出错了，稍后重试吧",
    Prompt: {
      History: (content: string) =>
        `这是 ai 和用户的历史聊天总结作为前情提要：${content}`,
      Topic:
        "直接返回这句话的简要主题，不要解释，如果没有主题，请直接返回“闲聊”",
      Summarize:
        "简要总结一下你和用户的对话，用作后续的上下文提示 prompt，控制在 50 字以内",
    },
    ConfirmClearAll: "确认清除所有聊天、设置数据？",
  },
  Copy: {
    Success: "已写入剪切板",
    Failed: "复制失败，请赋予剪切板权限",
  },
  Auth: {
    Welcome: "欢迎使用",
    TokenMissed: "缺少 Token",
    AlreadyHaveAccount: "已有账号？",
    HaveNoAccount: "还没有账号？",
    GoRegister: "去注册",
    GoLogin: "去登录",
    Login: "登录",
    Register: "注册",
    EmailTitle: "邮箱",
    EmailPlaceholder: "请输入邮箱",
    PasswordTitle: "密码",
    PasswordPlaceholder: "请输入密码",
    ConfirmPasswordTitle: "确认密码",
    ConfirmPasswordPlaceholder: "请再次输入密码",
    RememberMe: "记住我",
    ForgotPassword: "忘记密码",
    EmptyFields: "请填写完整",
    PasswordsNotMatch: "两次输入的密码不一致",
    TryInputAgain: "请重新输入",
    EmailNotValid: "邮箱格式不正确",
    PasswordInvalid: "密码格式不正确",
  },
  NavBar: {
    Home: "主页",
    Settings: "设置",
    Logout: "退出登录",
  },
  Common: {
    OK: "确定",
    Cancel: "取消",
    Delete: "删除",
    Edit: "编辑",
    Save: "保存",
    Close: "关闭",
    Copy: "复制",
  },
};

export type LocaleType = typeof cn;

export default cn;
