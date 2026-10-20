# DSH Aero Glass

[English](README.md) | [简体中文](README.zh-CN.md)

给 **DSH Desktop** 的 Web UI 加上 Windows 7 Aero 风格的毛玻璃皮肤，并附带一个可选的 Windows 10 原生模糊补丁，让窗口真正透出后面的桌面和其他窗口。

项目分两部分，可以单独使用：

| 部分 | 作用 | 安装方式 |
| --- | --- | --- |
| **页面皮肤**（`dsh-aero-skin`） | 玻璃配色、半透明面板、标题栏/头部/按钮处理、设置开关 | DSH 插件市场或本地安装 |
| **原生补丁**（`aero/`，可选） | 透明 Electron 窗口 + DWM BlurBehind + 任务栏 Acrylic | 下载预编译资产或本地构建，替换 `app.asar` 后重启 |

页面皮肤本身就能工作：没有原生补丁时，它会画一层页内极光壁纸并模拟磨砂；原生补丁则让桌面和其他窗口真正出现在玻璃后面。

![当前窗口效果](shots/demo-native.png)

![头部特写](shots/demo-header-closeup.png)

![任务栏](shots/demo-taskbar.png)

---

## 安装页面皮肤

### 从 DSH 插件市场安装

1. 打开 **插件**，点击 **实验性插件** 旁的 **更多**，开启 **自定义插件市场**；
2. 打开 **发现** → **添加索引源**，填入：

   ```text
   https://cdn.jsdelivr.net/gh/haitunlang/dsh-aero-glass@main/market/index.json
   ```

3. 找到 **Aero Glass Skin**，安装 v1.0.0。

DSH 的插件市场是一个自托管的 JSON 索引（见
[官方说明](https://deepseek-harness.github.io/deepseek-harness/guide/plugin-market)）。
本仓库的索引指向 `dsh-aero-skin/` 目录在固定 commit 上的 Git source。

### 手动 / 开发安装

把 `dsh-aero-skin/` 作为本地 bundle 通过 DSH 插件管理器安装，或按 DSH 安装本地 bundle 的方式链接进 profile 的 `node_modules`。包内声明了 `dsh.bundle` 和 `dsh.client`，Host 会加载补丁，Web UI 会加载 `client.js`。

安装后刷新页面或重启 DSH。标题栏会出现 **Aero** 胶囊，设置 → 通用里会出现 **Aero 玻璃效果** 一行；两者共用 `dsh-aero:enabled` 这个 localStorage 键。

> 如果本地已经启用了 `@local/dsh-aero-skin` 开发版，请先禁用再装市场版；两份会重复叠加同一套样式。

---

## 使用预编译原生补丁（可选）

> 高级且绑定版本。补丁会修改 `resources/app.asar`，操作前一定要备份。

Release **v1.0.0** 提供了预编译资产，适合不想自己跑构建脚本的用户：

- [app.asar.patched](https://github.com/haitunlang/dsh-aero-glass/releases/download/v1.0.0/app.asar.patched)（182,798,359 字节，SHA256 `5ACA0F97BAB4560DDC6CEBCDDC0E89950931273FB9BD89F9720B2E0E039EFB5C`）
- [main.patched.js](https://github.com/haitunlang/dsh-aero-glass/releases/download/v1.0.0/main.patched.js)（520,410 字节，SHA256 `7EDC71A8D602BC6CA870CD49E6A29CFBA6C9669AB726E6437F134CC7B155750E`）
- [SHA256SUMS.txt](https://github.com/haitunlang/dsh-aero-glass/releases/download/v1.0.0/SHA256SUMS.txt)

**只适用于 DSH Desktop 0.2.1-rc.2 / Electron 44.7.0 / Windows 10。** 其他 DSH 版本请不要直接套用，按下面的“自行构建”重新生成。

### 安装

1. 完全关闭 DSH；
2. 备份 `resources/app.asar`（例如改名为 `app.asar.orig`）；
3. 用下载的 `app.asar.patched` 覆盖 `resources/app.asar`；
4. 从 DSH 安装目录重新启动。

要还原：关闭 DSH，把备份改回 `resources/app.asar`，再启动。

### 自行构建

如果版本不同，或想确认补丁内容：

```powershell
cd aero
$env:DSH_ROOT = 'D:\DSH'
node extract-main.js
node patch-main.js
node repack.js
```

然后用生成的 `aero/app.asar.patched` 替换。详细说明见 [`aero/README.zh-CN.md`](aero/README.zh-CN.md)。

### 资产说明

预编译 `app.asar.patched` 是**上游 DSH 0.2.1-rc.2 应用 + 本补丁**的便捷打包，包含 DSH 自身的代码；它**不属于 MIT 许可**，DSH 代码仍归其权利人所有。请仅在已经合法使用 DSH 的环境中使用，并按需删除。仓库里的 MIT 许可只覆盖本项目原创的插件、脚本和文档。

---

## 皮肤具体改了什么

- 约 50 个 `--dsw-alias-*` 令牌换成亮/暗两套玻璃配色；
- shell 框架、侧栏、内容面板半透明，并叠加细噪点；
- Windows 标题栏条使用与内容一致的玻璃填充，不再是一条白亮高光带；
- 对话头部完全扁平：透明背景、无渐变、无底边线；
- 头部控件嵌入背景：创建模式胶囊无白底，文件夹按钮改为 `currentColor` 线性图标，工具栏包裹层无白色方块；
- 内容列左上角圆角归零，消除侧栏/头部交界处的缺口；
- 标题栏 Aero 胶囊和设置开关控制整套皮肤。

页面皮肤依赖当前 DSH 构建的类名锚点（`Dc7zOa_header`、`b06ba0_trigger`、`appIcon` 等）。DSH 升级后这些细节可能失效，但会退回默认样式，不会导致应用崩溃。

---

## 注意与限制

- **原生补丁只支持 Windows 10**；Windows 11 使用不同的材质 API，未验证。
- 预编译 asar 只对应 DSH 0.2.1-rc.2；DSH 更新会覆盖 `app.asar`，补丁失效。
- 任务栏材质是系统级效果，DSH 运行期间每 5 秒重新应用；关闭 DSH 后可能保留到 Explorer 重启。
- 只处理主任务栏 `Shell_TrayWnd`，多显示器副任务栏未处理。
- 页面皮肤的类名选择器是“尽力而为”，DSH 大版本更新后建议重新核对。
- 文件选择器按钮现在显示线性文件夹，不再显示 File Explorer 彩色应用图标；白色底图是原图标自带的，无法只去底图保留原图。
- 关闭页面皮肤开关不会关闭主窗口透明和任务栏材质，这两项由原生补丁控制。

---

## 仓库结构

```text
dsh-aero-skin/       页面皮肤 bundle（市场包）
aero/                可选原生补丁脚本 + 中英文说明
tools/               截图 / DWM 辅助工具（开发用）
shots/               README 截图
LICENSE              MIT
```

原生补丁的输出（`main.orig.js`、`main.patched.js`、`app.asar.patched`）不进入 git；预编译版本放在 Release 资产里。

---

## 开发

页面皮肤集中在 `dsh-aero-skin/client.js`：

- `TOKENS`：玻璃令牌层；
- `CSS`：`html[data-aero]` 作用域的样式、原生模式和回退模式；
- `apply()`：主题注册、CSS 注入、标题栏胶囊和设置行。

`tools/` 里是截图（`ds-shot.ps1`）、任务栏材质（`taskbar-test.js`）和拖动基准工具；它们默认 Windows DSH 环境，支持 `DSH_ROOT` 的地方可用环境变量覆盖。

---

## 许可证

MIT，见 [LICENSE](LICENSE)。

MIT 只覆盖本仓库的原创代码和资源。DSH、Electron 及其依赖不包含在 MIT 授权范围内，仍归各自权利人所有。原生补丁脚本用于与本机 DSH 互操作；Release 里的预编译 asar 包含上游 DSH 应用，不是 MIT 资产。

截图中的 DSH 界面和本地桌面壁纸仅用于演示。
