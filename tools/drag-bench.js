const koffi = require('D:/DSH/resources/app.asar.unpacked/dsh/node_modules/koffi');
const user32 = koffi.load('user32.dll');
const dwmapi = koffi.load('dwmapi.dll');

const ACCENT_POLICY = koffi.struct('BENCH_ACCENT_POLICY', {
  AccentState: 'int',
  AccentFlags: 'int',
  GradientColor: 'uint32_t',
  AnimationId: 'int',
});
const WCAD = koffi.struct('BENCH_WCAD', {
  Attrib: 'int',
  pvData: 'BENCH_ACCENT_POLICY *',
  cbData: 'size_t',
});
const SetWindowCompositionAttribute = user32.func(
  'bool __stdcall SetWindowCompositionAttribute(uintptr_t hwnd, BENCH_WCAD *data)',
);
const SetWindowPos = user32.func(
  'bool __stdcall SetWindowPos(uintptr_t hwnd, uintptr_t after, int x, int y, int cx, int cy, uint32_t flags)',
);
const DwmFlush = dwmapi.func('long __stdcall DwmFlush()');

const hwnd = BigInt(process.argv[2]);
const state = Number(process.argv[3]);
const tint = process.argv[4] ? Number(process.argv[4]) : 0x33ffffff;
const apply = (accentState, color) =>
  SetWindowCompositionAttribute(hwnd, {
    Attrib: 19,
    pvData: {
      AccentState: accentState,
      AccentFlags: accentState === 4 ? 2 : 0,
      GradientColor: color,
      AnimationId: 0,
    },
    cbData: koffi.sizeof(ACCENT_POLICY),
  });

apply(state, tint);
for (let i = 0; i < 8; i += 1) {
  SetWindowPos(hwnd, 0n, 1040 + i, 307, 0, 0, 0x15);
  DwmFlush();
}
const start = process.hrtime.bigint();
for (let i = 0; i < 40; i += 1) {
  SetWindowPos(hwnd, 0n, 1036 + (i % 10), 307, 0, 0, 0x15);
  DwmFlush();
}
const end = process.hrtime.bigint();
SetWindowPos(hwnd, 0n, 1036, 307, 0, 0, 0x15);
DwmFlush();
console.log('state', state, 'ms', Number(end - start) / 1e6);
