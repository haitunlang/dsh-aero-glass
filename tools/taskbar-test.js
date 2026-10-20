const path = require('path');
const dshRoot = process.env.DSH_ROOT || 'D:/DSH';
const koffi = require(path.join(dshRoot, 'resources', 'app.asar.unpacked', 'dsh', 'node_modules', 'koffi'));
const user32 = koffi.load('user32.dll');

const ACCENT_POLICY = koffi.struct('TB_ACCENT_POLICY', {
  AccentState: 'int',
  AccentFlags: 'int',
  GradientColor: 'uint32_t',
  AnimationId: 'int',
});
const WCAD = koffi.struct('TB_WCAD', {
  Attrib: 'int',
  pvData: 'TB_ACCENT_POLICY *',
  cbData: 'size_t',
});
const SetWindowCompositionAttribute = user32.func(
  'bool __stdcall SetWindowCompositionAttribute(uintptr_t hwnd, TB_WCAD *data)',
);
const FindWindowA = user32.func(
  'uintptr_t __stdcall FindWindowA(const char *className, const char *windowName)',
);

const hwnd = FindWindowA('Shell_TrayWnd', null);
const state = Number(process.argv[2] || 4);
const color = process.argv[3] ? Number(process.argv[3]) : 0x99000000;
const ok = SetWindowCompositionAttribute(hwnd, {
  Attrib: 19,
  pvData: { AccentState: state, AccentFlags: state === 4 ? 2 : 0, GradientColor: color, AnimationId: 0 },
  cbData: koffi.sizeof(ACCENT_POLICY),
});
console.log('taskbar', hwnd.toString(16), 'state', state, 'color', color.toString(16), '->', ok);
