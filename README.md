# 🍅 Pomodoro Timer

一个简洁优雅的番茄钟应用，纯前端实现，无需安装任何依赖，打开即用。

## 功能

- **25 分钟专注 + 5 分钟休息**，交替循环
- **圆形进度环**，直观显示剩余时间
- **浏览器通知**，到点提醒不遗漏
- **提示音**（Web Audio API），计时结束蜂鸣
- **完成统计**，记录专注轮数和总时长
- **双击切换**，支持手动切换工作/休息模式
- **响应式设计**，桌面端和移动端均可使用
- **暗色主题**，护眼舒适

## 使用方法

### 方式一：直接打开

双击 `index.html` 即可在浏览器中运行。

### 方式二：本地服务器

```bash
# 使用 Python
python -m http.server 8080

# 使用 Node.js (需要先安装 serve)
npx serve .
```

然后访问 `http://localhost:8080`。


## 快捷键 / 技巧

| 操作 | 方式 |
|------|------|
| 开始计时 | 点击「开始」按钮 |
| 暂停计时 | 点击「暂停」按钮 |
| 重置计时 | 点击「重置」按钮 |
| 切换模式 | 双击时间数字 |

## 技术栈

- HTML5
- CSS3（CSS 自定义属性、Flexbox、SVG 动画）
- Vanilla JavaScript（ES6+）
- Web Audio API（提示音）
- Notification API（浏览器通知）

零框架、零构建工具、零外部依赖。

## 项目结构

```
pomodoro-timer/
├── index.html      # 主页面
├── style.css       # 样式表
├── app.js          # 核心逻辑
├── LICENSE         # MIT 许可证
└── README.md       # 项目说明
```

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 12+ |
| Edge | 79+ |

## 开源许可

MIT License — 详见 [LICENSE](./LICENSE) 文件。
