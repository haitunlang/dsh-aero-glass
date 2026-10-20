# Windows 10 原生模糊补丁（可选）

[English](README.md) | [简体中文](README.zh-CN.md)

这个目录是 DSH Aero Glass 的**可选原生部分**，不装也不影响页面皮肤，市场里的插件不包含它。

补丁会在 Windows 10 上修改 DSH Desktop 的 `resources/app.asar`，把主窗口变成透明的 DWM 表面；页面皮肤随后关闭页内壁纸，让系统把真实桌面和后面的窗口模糊。

> 这是高级且绑定版本的修改。操作前一定要备份 `resources/app.asar`。不要把某个 DSH 版本的补丁 asar 套到另一个版本上。

## 预编译资产

Release **v1.0.0** 提供了直接可用的文件，适合不想自己构建的用户：

- [app.asar.patched](https://github.com/haitunlang/dsh-aero-glass/releases/download/v1.0.0/app.asar.patched)
  - 182,798,359 字节
  - SHA256 `5ACA0F97BAB4560DDC6CEBCDDC0E89950931273FB9BD89F9720B2E0E039EFB5C`
- [main.patched.js](https://github.com/haitunlang/dsh-aero-glass/releases/download/v1.0.0/main.patched.js)
  - 520,410 字节
  - SHA256 `7EDC71A8D602BC6CA870CD49E6A29CFBA6C9669AB726E6437F134CC7B155750E`
- [SHA256SUMS.txt](https://github.com/haitunlang/dsh-aero-glass/releases/download/v1.0.0/SHA256SUMS.txt)

**只适用于 DSH Desktop 0.2.1-rc.2 / Electron 44.7.0 / Windows 10。** 其他版本请从自己的安装构建。

> 预编译 asar 是“上游 DSH 应用 + 本补丁”的完整打包，包含 DSH 自身代码，**不属于 MIT 许可**。请只在已经合法使用 DSH 的环境中使用。

## 环境要求

- Windows 10（在 22H2 / build 19045 验证）
- DSH Desktop **0.2.1-rc.2** / Electron 44.7.0
- PATH 中有 Node.js
- `resources/app.asar` 的 asar 完整性 fuse 已关闭
  （`EnableEmbeddedAsarIntegrityValidation: Disabled`），否则重建的包会被拒绝

## 文件

| 文件 | 用途 |
| --- | --- |
| `extract-main.js` | 从已安装的 `app.asar` 读取 `lib/main.js`，保存为 `main.orig.js` |
| `patch-main.js` | 对 `main.orig.js` 应用透明窗口、DWM 模糊、任务栏改动，生成 `main.patched.js` |
| `repack.js` | 用补丁后的 `main.js` 重建 `app.asar.patched`，并校验偏移/抽样哈希 |
| `verify-asar.js` | 可选的官方 `@electron/asar` 回读校验 |

`main.orig.js`、`main.patched.js`、`app.asar.patched` 和 DSH 源码**不在 git 里**；预编译版本放在 Release 资产。

## 路径

`extract-main.js` 和 `repack.js` 使用：

- `DSH_ROOT`：DSH 安装目录，默认 `D:\DSH`；
- `DSH_ASAR`：可选的 `app.asar` 完整路径，优先于 `DSH_ROOT`；
- 脚本所在目录：输出 `main.orig.js`、`main.patched.js`、`app.asar.patched`。

PowerShell 示例：

```powershell
cd aero
$env:DSH_ROOT = 'D:\DSH'
node extract-main.js
node patch-main.js
node repack.js
# 可选，先 npm install --no-save @electron/asar
node verify-asar.js
```

## 安装

1. 完全关闭 DSH；
2. 备份 `resources/app.asar`（例如改名为 `app.asar.orig`）；
3. 把 `app.asar.patched` 复制为 `resources/app.asar`；
4. 从 DSH 安装目录重新启动。

还原：关闭 DSH，把备份改回 `resources/app.asar`，再启动。

## 补丁改了什么

- Windows 主窗口增加 `transparent: true`、`backgroundColor: "#00000000"`；
- 新增 `enableWindowAcrylic()`，通过 DSH 自带的 koffi 调用 `user32!SetWindowCompositionAttribute`；
- **窗口**使用 `AccentState: 3`（`ACCENT_ENABLE_BLURBEHIND`），tint `0x33FFFFFF`；
- **任务栏**（`Shell_TrayWnd`）使用 `AccentState: 4`（Acrylic），tint `0xCC1A2A3A`，每 5 秒重新应用一次，Explorer 重启后也能恢复；
- 页面加载后设置 `html[data-aero][data-aero-native]`，皮肤据此从页内壁纸切换到真实透明。

### 为什么窗口不用 Acrylic？

同样的 40 次窗口移动 + `DwmFlush` 实测：

| 材质 | 耗时 |
| --- | --- |
| 无材质 | 533 ms |
| BlurBehind（state 3） | 533 ms |
| Acrylic（state 4） | 1066 ms |

Acrylic 每帧重算噪声/模糊，是拖动不跟手的根因；BlurBehind 视觉接近且与无材质同速。任务栏不需要拖动，所以可以用 Acrylic。

## 注意与限制

- 只支持 Windows 10；Windows 11 的材质 API 不同。
- DSH 自动更新会覆盖 `app.asar`；更新后需要按新版本重新生成补丁。
- 任务栏是系统级效果，DSH 运行期间每 5 秒重新应用；关闭 DSH 后可能保留到 Explorer 重启。
- 只处理主任务栏 `Shell_TrayWnd`，多显示器副任务栏未处理。
- `patch-main.js` 依赖 0.2.1-rc.2 的锚点，源码变化会直接报错；这是有意保护。
- 日志写入 `%TEMP%\dsh-aero-native.log`。
- 预编译 asar 含上游 DSH 代码，不属于 MIT；仓库的 MIT 许可只覆盖原创脚本和文档。
