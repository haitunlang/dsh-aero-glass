const pathToKoffi = process.argv[2];
const hwndArg = process.argv[3];
const koffi = require(pathToKoffi);
const user32 = koffi.load('user32.dll');

const ACCENT_POLICY = koffi.struct('ACCENT_POLICY', {
  AccentState: 'int',
  AccentFlags: 'int',
  GradientColor: 'uint32_t',
  AnimationId: 'int',
});
const WCAD = koffi.struct('WINDOWCOMPOSITIONATTRIBDATA', {
  Attrib: 'int',
  pvData: 'ACCENT_POLICY *',
  cbData: 'size_t',
});
const SetWindowCompositionAttribute = user32.func(
  'bool __stdcall SetWindowCompositionAttribute(uintptr_t hwnd, WINDOWCOMPOSITIONATTRIBDATA *data)',
);

const hwnd = BigInt(hwndArg);
const call = (state, flags, color) =>
  SetWindowCompositionAttribute(hwnd, {
    Attrib: 19,
    pvData: { AccentState: state, AccentFlags: flags, GradientColor: color, AnimationId: 0 },
    cbData: koffi.sizeof(ACCENT_POLICY),
  });

console.log('koffi', koffi.version || 'loaded');
console.log('sizeof', koffi.sizeof(ACCENT_POLICY));
console.log('acrylic(4,2,0x99FFFFFF) ->', call(4, 2, 0x99ffffff));
console.log('acrylic(4,0,0xCCFFFFFF) ->', call(4, 0, 0xccffffff));
console.log('blur(3) ->', call(3, 0, 0));
console.log('disabled(0) ->', call(0, 0, 0));
