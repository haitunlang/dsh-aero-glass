# Native Windows 10 blur patch (optional)

This folder is the **optional native half** of DSH Aero Glass. It is not
required for the page skin and is not installable from the plugin market.

It patches the DSH Desktop `resources/app.asar` on Windows 10 so the main
window becomes a transparent DWM surface. The page skin then removes its
in-page wallpaper and lets the OS blur the real desktop and the windows behind
DSH.

> This is an advanced, version-specific modification. Back up
> `resources/app.asar` before running anything. Do not apply a patched asar
> from one DSH version to another.

## Requirements

- Windows 10 (tested on 22H2 / build 19045)
- DSH Desktop **0.2.1-rc.2** / Electron 44.7.0
- Node.js available on `PATH`
- `resources/app.asar` with the asar-integrity fuse disabled
  (`EnableEmbeddedAsarIntegrityValidation: Disabled`), otherwise the app will
  reject the rebuilt archive

## Files

| File | Purpose |
| --- | --- |
| `extract-main.js` | Read `lib/main.js` from the installed `app.asar` and save `main.orig.js` |
| `patch-main.js` | Apply the transparent-window, DWM blur and taskbar changes to `main.patched.js` |
| `repack.js` | Rebuild `app.asar.patched` with the patched `lib/main.js` and verify offsets/hashes |
| `verify-asar.js` | Optional read-back with the official `@electron/asar` package |

`main.orig.js`, `main.patched.js`, `app.asar.patched` and the DSH source are
**not** committed to this repository.

## Paths

`extract-main.js` and `repack.js` use:

- `DSH_ROOT` — the DSH install directory, default `D:\DSH`;
- `DSH_ASAR` — optional full path to `app.asar`, overriding `DSH_ROOT`;
- the folder containing these scripts for `main.orig.js`, `main.patched.js`
  and `app.asar.patched`.

PowerShell example:

```powershell
cd aero
$env:DSH_ROOT = 'D:\DSH'
node extract-main.js
node patch-main.js
node repack.js
# optional, after: npm install --no-save @electron/asar
node verify-asar.js
```

## Install

1. Close DSH completely.
2. Back up `resources/app.asar` (for example to `app.asar.orig`).
3. Copy `aero/app.asar.patched` to `resources/app.asar`.
4. Start DSH from its install directory.

To undo, close DSH and copy the backup back over `resources/app.asar`.

## What the patch changes

- `transparent: true` and `backgroundColor: "#00000000"` for the Windows main
  window;
- a new `enableWindowAcrylic()` helper that calls
  `user32!SetWindowCompositionAttribute` through the koffi module shipped with
  DSH;
- the **window** uses `AccentState: 3` (`ACCENT_ENABLE_BLURBEHIND`) with tint
  `0x33FFFFFF`;
- the **taskbar** (`Shell_TrayWnd`) uses `AccentState: 4` (Acrylic) with tint
  `0xCC1A2A3A`, re-applied every 5 seconds so it survives Explorer restarts;
- after page load, `html[data-aero][data-aero-native]` is set so the skin
  switches from its in-page wallpaper to real transparency.

### Why BlurBehind instead of Acrylic for the window?

The same 40 window moves plus `DwmFlush` measured:

| Material | Time |
| --- | --- |
| None | 533 ms |
| BlurBehind (state 3) | 533 ms |
| Acrylic (state 4) | 1066 ms |

Acrylic recomputes its noise/blur every frame and made dragging feel laggy;
BlurBehind looks close and costs the same as no material. The taskbar can
afford Acrylic because it is not dragged.

## Notes and limitations

- Windows 10 only; Windows 11 uses a different material API.
- DSH updates overwrite `app.asar`; regenerate the patch for the new version.
- The taskbar effect is system-wide while DSH runs; restore the original asar
  or reset the taskbar accent to remove it.
- Only the primary taskbar (`Shell_TrayWnd`) is handled; secondary-monitor
  taskbars are not.
- `patch-main.js` expects the 0.2.1-rc.2 anchors and will fail loudly if the
  source changed. That is intentional.
- Logs are written to `%TEMP%\dsh-aero-native.log`.
