const fs = require('fs');
const path = require('path');

const SOURCE = path.join(__dirname, 'main.orig.js');
const TARGET = path.join(__dirname, 'main.patched.js');

const helper = [
  '/**',
  ' * Make the Windows main window a DWM acrylic (Windows 10 frost) surface.',
  ' * The page paints a transparent background once html[data-aero-native] is set,',
  ' * so the OS blur of the desktop and every window behind it shows through.',
  ' */',
  'function enableWindowAcrylic(window) {',
  '\tif (process.platform !== "win32") return;',
  '\tconst writeLog = (message) => {',
  '\t\ttry {',
  '\t\t\tconst fs = process.getBuiltinModule("node:fs");',
  '\t\t\tconst os = process.getBuiltinModule("node:os");',
  '\t\t\tconst path = process.getBuiltinModule("node:path");',
  '\t\t\tfs.appendFileSync(path.join(os.tmpdir(), "dsh-aero-native.log"), new Date().toISOString() + " " + message + "\\n");',
  '\t\t} catch {}',
  '\t};',
  '\tlet apply = null;',
  '\ttry {',
  '\t\tconst path = process.getBuiltinModule("node:path");',
  '\t\tconst { createRequire } = process.getBuiltinModule("node:module");',
  '\t\tconst requireFromApp = createRequire(import.meta.url);',
  '\t\tconst koffi = requireFromApp(path.join(process.resourcesPath, "app.asar.unpacked", "dsh", "node_modules", "koffi"));',
  '\t\tconst user32 = koffi.load("user32.dll");',
  '\t\tconst ACCENT_POLICY = koffi.struct("DSH_ACCENT_POLICY", {',
  '\t\t\tAccentState: "int",',
  '\t\t\tAccentFlags: "int",',
  '\t\t\tGradientColor: "uint32_t",',
  '\t\t\tAnimationId: "int"',
  '\t\t});',
  '\t\tconst WCAD = koffi.struct("DSH_WCAD", {',
  '\t\t\tAttrib: "int",',
  '\t\t\tpvData: "DSH_ACCENT_POLICY *",',
  '\t\t\tcbData: "size_t"',
  '\t\t});',
  '\t\tconst SetWindowCompositionAttribute = user32.func("bool __stdcall SetWindowCompositionAttribute(uintptr_t hwnd, DSH_WCAD *data)");',
'\t\tconst FindWindowA = user32.func("uintptr_t __stdcall FindWindowA(const char *className, const char *windowName)");',
'\t\tlet taskbarFailed = false;',
'\t\tconst applyTaskbar = () => {',
'\t\t\ttry {',
'\t\t\t\tconst tray = FindWindowA("Shell_TrayWnd", null);',
'\t\t\t\tif (tray !== 0n) SetWindowCompositionAttribute(tray, { Attrib: 19, pvData: { AccentState: 4, AccentFlags: 2, GradientColor: 0xCC1A2A3A, AnimationId: 0 }, cbData: koffi.sizeof(ACCENT_POLICY) });',
'\t\t\t} catch (error) {',
'\t\t\t\tif (!taskbarFailed) {',
'\t\t\t\t\ttaskbarFailed = true;',
'\t\t\t\t\twriteLog("taskbar blur failed: " + (error && error.stack ? error.stack : error));',
'\t\t\t\t}',
'\t\t\t}',
'\t\t};',
'\t\tapplyTaskbar();',
'\t\tsetInterval(applyTaskbar, 5000);',
  '\t\tlet last = null;',
  '\t\tapply = () => {',
  '\t\t\ttry {',
  '\t\t\t\tif (window.isDestroyed()) return false;',
  '\t\t\t\tconst hwnd = window.getNativeWindowHandle().readBigUInt64LE(0);',
  '\t\t\t\tconst ok = SetWindowCompositionAttribute(hwnd, {',
  '\t\t\t\t\tAttrib: 19,',
  '\t\t\t\t\tpvData: {',
  '\t\t\t\t\t\tAccentState: 3,',
  '\t\t\t\t\t\tAccentFlags: 0,',
  '\t\t\t\t\t\tGradientColor: 0x33ffffff,',
  '\t\t\t\t\t\tAnimationId: 0',
  '\t\t\t\t\t},',
  '\t\t\t\t\tcbData: koffi.sizeof(ACCENT_POLICY)',
  '\t\t\t\t});',
  '\t\t\t\tif (ok !== last) {',
  '\t\t\t\t\tlast = ok;',
  '\t\t\t\t\twriteLog("acrylic " + (ok ? "on" : "off") + " hwnd=" + hwnd.toString(16));',
  '\t\t\t\t}',
  '\t\t\t\treturn ok;',
  '\t\t\t} catch (error) {',
  '\t\t\t\twriteLog("acrylic call failed: " + (error && error.stack ? error.stack : error));',
  '\t\t\t\treturn false;',
  '\t\t\t}',
  '\t\t};',
  '\t} catch (error) {',
  '\t\twriteLog("acrylic setup failed: " + (error && error.stack ? error.stack : error));',
  '\t}',
  '\tconst markNative = () => {',
  '\t\ttry {',
  '\t\t\tif (window.isDestroyed() || window.webContents.isDestroyed()) return;',
  '\t\t\twindow.webContents.executeJavaScript("document.documentElement.setAttribute(\'data-aero-native\',\'1\')").catch(() => {});',
  '\t\t} catch {}',
  '\t};',
  '\twindow.webContents.on("dom-ready", markNative);',
  '\twindow.webContents.on("did-finish-load", markNative);',
  '\tif (apply !== null) {',
  '\t\twindow.on("show", () => apply());',
  '\t\twindow.on("focus", () => apply());',
  '\t\twindow.on("maximize", () => apply());',
  '\t\twindow.on("restore", () => apply());',
  '\t\tapply();',
  '\t\tsetTimeout(() => apply(), 700);',
  '\t\tsetTimeout(() => apply(), 2000);',
  '\t}',
  '\tsetTimeout(markNative, 2500);',
  '\twriteLog("acrylic hook installed");',
  '}',
].join('\n');

let source = fs.readFileSync(SOURCE, 'utf8');

function replaceOnce(from, to, label) {
  const count = source.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected 1 match, found ${count}`);
  source = source.replace(from, to);
}

replaceOnce(
  'function createWindow(preload, show = false, primary = false) {',
  helper + '\nfunction createWindow(preload, show = false, primary = false) {',
  'createWindow anchor',
);

replaceOnce(
  '\t\t...process.platform === "win32" && primary ? {\n\t\t\ttitleBarStyle: "hidden",',
  '\t\t...process.platform === "win32" && primary ? {\n\t\t\ttransparent: true,\n\t\t\tbackgroundColor: "#00000000",\n\t\t\ttitleBarStyle: "hidden",',
  'win32 window options',
);

replaceOnce(
  '\twindow.webContents.setWindowOpenHandler(({ url }) => {',
  '\tif (process.platform === "win32" && primary) enableWindowAcrylic(window);\n\twindow.webContents.setWindowOpenHandler(({ url }) => {',
  'acrylic call',
);

fs.writeFileSync(TARGET, source);
console.log('patched bytes', Buffer.byteLength(source));
console.log('source bytes', fs.statSync(SOURCE).size);
