window.__ModuleLoader__.load({
  id: 'dsh-aero-skin',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const SOURCE = 'dsh-aero-skin';
    const STORAGE_KEY = 'dsh-aero:enabled';
    const CSS_TAG = 'dsh-aero-skin/aero.css';

    /**
     * Semantic-token layer for the Aero material. Only tokens the shipped
     * stylesheets already consume are overridden; the base light/dark themes
     * stay registered and every value has a light and a dark member.
     */
    const TOKENS = {
      '--dsw-alias-bg-base': {
        light: 'rgba(238, 247, 255, 0.30)',
        dark: 'rgba(12, 26, 42, 0.38)',
      },
      '--dsw-alias-bg-layer-1': {
        light: 'rgba(255, 255, 255, 0.34)',
        dark: 'rgba(18, 36, 56, 0.38)',
      },
      '--dsw-alias-bg-layer-2': {
        light: 'rgba(250, 253, 255, 0.55)',
        dark: 'rgba(24, 45, 68, 0.58)',
      },
      '--dsw-alias-bg-layer-3': {
        light: 'rgba(255, 255, 255, 0.68)',
        dark: 'rgba(30, 54, 80, 0.70)',
      },
      '--dsw-alias-bg-overlay': {
        light: 'rgba(240, 249, 255, 0.94)',
        dark: 'rgba(13, 29, 47, 0.94)',
      },
      '--dsw-alias-bg-module-platform': {
        light: 'rgba(219, 238, 255, 0.55)',
        dark: 'rgba(18, 37, 58, 0.55)',
      },
      '--dsw-alias-bg-mask-1': {
        light: 'rgba(8, 34, 62, 0.30)',
        dark: 'rgba(0, 8, 18, 0.48)',
      },
      '--dsw-alias-bg-document-preview': {
        light: '#eef7ff',
        dark: '#0d1c2d',
      },
      '--dsw-alias-label-document-preview': {
        light: '#2d5377',
        dark: '#a9cae8',
      },
      /* Transparent so the native caption strip shows the page's glass
         instead of compositing its own pale opaque block over it. */
      '--dsw-specific-sidebar-fill': {
        light: 'rgba(0, 0, 0, 0)',
        dark: 'rgba(0, 0, 0, 0)',
      },
      '--dsw-menu-surface-fill': {
        light: 'rgba(238, 248, 255, 0.74)',
        dark: 'rgba(15, 33, 52, 0.74)',
      },
      /* Composer and preview surfaces otherwise stay opaque white. */
      '--dsw-specific-input-major': {
        light: 'rgba(250, 253, 255, 0.46)',
        dark: 'rgba(20, 40, 62, 0.50)',
      },
      '--dsw-menu-backdrop-filter': {
        light: 'blur(30px) saturate(165%)',
        dark: 'blur(30px) saturate(150%)',
      },
      '--dsw-mask-blur': {
        light: 'blur(6px)',
        dark: 'blur(6px)',
      },
      '--dsw-alias-border-l1': {
        light: 'rgba(31, 86, 140, 0.10)',
        dark: 'rgba(150, 205, 255, 0.12)',
      },
      '--dsw-alias-border-l2': {
        light: 'rgba(31, 86, 140, 0.16)',
        dark: 'rgba(150, 205, 255, 0.18)',
      },
      '--dsw-alias-border-l3': {
        light: 'rgba(31, 86, 140, 0.22)',
        dark: 'rgba(150, 205, 255, 0.24)',
      },
      '--dsw-alias-border-l4': {
        light: 'rgba(31, 86, 140, 0.28)',
        dark: 'rgba(150, 205, 255, 0.30)',
      },
      '--dsw-alias-label-primary': {
        light: '#061b2e',
        dark: '#e9f5ff',
      },
      '--dsw-alias-label-secondary': {
        light: '#1c4163',
        dark: '#a9cae8',
      },
      '--dsw-alias-label-tertiary': {
        light: '#345a7c',
        dark: '#7fa4c4',
      },
      '--dsw-alias-label-caption': {
        light: '#476b8c',
        dark: '#6b8dab',
      },
      '--dsw-alias-label-dimmed': {
        light: '#6b89a6',
        dark: '#587a99',
      },
      '--dsw-alias-label-primary-foreground': {
        light: '#ffffff',
        dark: '#ffffff',
      },
      '--dsw-alias-brand-primary': {
        light: '#2f8bd4',
        dark: '#4aa6e8',
      },
      '--dsw-alias-brand-text': {
        light: '#0a2742',
        dark: '#e9f5ff',
      },
      '--dsw-alias-button-primary-fill': {
        light: '#2f8bd4',
        dark: '#3d99dd',
      },
      '--dsw-alias-button-primary-hover': {
        light: '#1f74bb',
        dark: '#5db4f2',
      },
      '--dsw-alias-button-elevated-fill': {
        light: 'rgba(255, 255, 255, 0.80)',
        dark: 'rgba(32, 58, 84, 0.80)',
      },
      '--dsw-alias-button-floating-fill': {
        light: 'rgba(255, 255, 255, 0.86)',
        dark: 'rgba(26, 48, 72, 0.86)',
      },
      '--dsw-alias-interactive-bg-hover': {
        light: 'rgba(47, 139, 212, 0.14)',
        dark: 'rgba(96, 176, 240, 0.18)',
      },
      '--dsw-alias-interactive-bg-active': {
        light: 'rgba(47, 139, 212, 0.20)',
        dark: 'rgba(96, 176, 240, 0.26)',
      },
      '--dsw-alias-interactive-bg-hover-accent': {
        light: 'rgba(47, 139, 212, 0.18)',
        dark: 'rgba(96, 176, 240, 0.22)',
      },
      '--dsw-alias-state-business-primary': {
        light: '#1f7fce',
        dark: '#5fb6ff',
      },
      '--dsw-alias-state-idle-primary': {
        light: '#7d9ab5',
        dark: '#5f7f9c',
      },
      '--dsw-alias-link': {
        light: '#1769ad',
        dark: '#7cc6ff',
      },
      '--dsw-alias-menu-icon': {
        light: '#2f5478',
        dark: '#a9cae8',
      },
      '--dsw-alias-markdown-code-block': {
        light: 'rgba(240, 247, 255, 0.80)',
        dark: 'rgba(8, 22, 37, 0.70)',
      },
      '--dsw-alias-markdown-code-block-banner': {
        light: 'rgba(220, 238, 252, 0.86)',
        dark: 'rgba(15, 34, 54, 0.82)',
      },
      '--dsw-alias-markdown-inline-code': {
        light: 'rgba(255, 255, 255, 0.62)',
        dark: 'rgba(255, 255, 255, 0.08)',
      },
      '--dsw-alias-markdown-tag': {
        light: 'rgba(214, 235, 253, 0.75)',
        dark: 'rgba(40, 70, 100, 0.75)',
      },
      '--dsw-alias-scrollbar-bg-l1': {
        light: 'rgba(60, 105, 145, 0.30)',
        dark: 'rgba(150, 200, 240, 0.24)',
      },
      '--dsw-alias-scrollbar-bg-l2': {
        light: 'rgba(60, 105, 145, 0.36)',
        dark: 'rgba(150, 200, 240, 0.30)',
      },
      '--dsw-alias-scrollbar-hover-l1': {
        light: 'rgba(47, 139, 212, 0.55)',
        dark: 'rgba(110, 195, 255, 0.55)',
      },
      '--dsw-alias-scrollbar-hover-l2': {
        light: 'rgba(47, 139, 212, 0.60)',
        dark: 'rgba(110, 195, 255, 0.60)',
      },
      '--dsw-alias-menu-group-header-fill': {
        light: 'rgba(243, 250, 255, 0.94)',
        dark: 'rgba(20, 40, 62, 0.94)',
      },
      '--dsw-alias-switch-thumb': {
        light: '#ffffff',
        dark: '#ffffff',
      },
      '--dsw-alias-tooltip-bg': {
        light: 'rgba(16, 44, 72, 0.95)',
        dark: 'rgba(5, 16, 28, 0.95)',
      },
      '--dsw-alias-tooltip-key-bg': {
        light: 'rgba(255, 255, 255, 0.18)',
        dark: 'rgba(255, 255, 255, 0.12)',
      },
      '--dsw-alias-turn-trigger-bg': {
        light: 'rgba(232, 244, 255, 0.55)',
        dark: 'rgba(20, 40, 62, 0.55)',
      },
    };

    const CSS = `
/* ============================================================
   Aero glass skin — every rule is scoped to html[data-aero].
   Only stable anchors are used: body, #root, the shell frame that
   owns [data-shell-overlay], and the Desktop titlebar marker.
   ============================================================ */

html[data-aero] body {
  background-color: #04121f;
  background-image:
    radial-gradient(130% 130% at 50% 46%, rgba(0, 8, 18, 0) 55%, rgba(0, 8, 18, 0.50) 100%),
    radial-gradient(circle at 84% 24%, rgba(140, 245, 255, 0.50) 0 70px, rgba(140, 245, 255, 0) 140px),
    radial-gradient(circle at 76% 34%, rgba(255, 255, 255, 0.40) 0 26px, rgba(255, 255, 255, 0) 70px),
    radial-gradient(circle at 10% 64%, rgba(150, 110, 255, 0.35) 0 55px, rgba(150, 110, 255, 0) 120px),
    radial-gradient(circle at 26% 18%, rgba(255, 255, 255, 0.30) 0 24px, rgba(255, 255, 255, 0) 60px),
    radial-gradient(38% 30% at 72% 16%, rgba(0, 225, 255, 0.60) 0%, rgba(0, 225, 255, 0) 70%),
    radial-gradient(30% 26% at 88% 58%, rgba(0, 140, 255, 0.45) 0%, rgba(0, 140, 255, 0) 72%),
    radial-gradient(26% 22% at 12% 70%, rgba(120, 90, 255, 0.40) 0%, rgba(120, 90, 255, 0) 72%),
    radial-gradient(20% 16% at 38% 94%, rgba(0, 200, 220, 0.30) 0%, rgba(0, 200, 220, 0) 72%),
    radial-gradient(18% 14% at 55% 38%, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0) 70%),
    linear-gradient(115deg, rgba(0, 0, 0, 0) 20%, rgba(120, 230, 255, 0.45) 32%, rgba(255, 255, 255, 0.55) 36%, rgba(120, 230, 255, 0.25) 40%, rgba(0, 0, 0, 0) 52%),
    linear-gradient(95deg, rgba(0, 0, 0, 0) 55%, rgba(0, 190, 255, 0.35) 64%, rgba(0, 0, 0, 0) 72%),
    linear-gradient(160deg, #0c3352 0%, #08213a 42%, #071726 100%);
  background-attachment: fixed;
  background-size: cover;
}

html[data-aero] body[data-ds-dark-theme] {
  background-color: #020a12;
  background-image:
    radial-gradient(130% 130% at 50% 46%, rgba(0, 8, 18, 0) 44%, rgba(0, 4, 10, 0.72) 100%),
    radial-gradient(circle at 82% 22%, rgba(120, 230, 255, 0.40) 0 60px, rgba(120, 230, 255, 0) 120px),
    radial-gradient(circle at 72% 32%, rgba(255, 255, 255, 0.28) 0 22px, rgba(255, 255, 255, 0) 60px),
    radial-gradient(circle at 12% 66%, rgba(130, 90, 255, 0.28) 0 45px, rgba(130, 90, 255, 0) 100px),
    radial-gradient(38% 30% at 76% 10%, rgba(0, 210, 255, 0.50) 0%, rgba(0, 210, 255, 0) 70%),
    radial-gradient(30% 26% at 86% 62%, rgba(0, 110, 230, 0.42) 0%, rgba(0, 110, 230, 0) 72%),
    radial-gradient(26% 22% at 10% 74%, rgba(110, 80, 255, 0.30) 0%, rgba(110, 80, 255, 0) 72%),
    radial-gradient(18% 14% at 55% 40%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%),
    linear-gradient(115deg, rgba(0, 0, 0, 0) 20%, rgba(90, 220, 255, 0.28) 32%, rgba(255, 255, 255, 0.26) 36%, rgba(90, 220, 255, 0.16) 40%, rgba(0, 0, 0, 0) 52%),
    linear-gradient(160deg, #082033 0%, #041220 45%, #01060c 100%);
}

/* Native DWM acrylic mode: the Electron main process makes the window
   transparent and asks Windows 10 for an acrylic backdrop. The OS blurs the
   real desktop and every window behind DSH, so the page must not paint its
   own wallpaper over that backdrop. */
html[data-aero][data-aero-native] body {
  background: transparent;
}

html[data-aero][data-aero-native] body::before {
  opacity: 0.03;
}

html[data-aero][data-aero-native] #root div:has(> [data-shell-overlay]) {
  background-color: rgba(238, 247, 255, 0.04);
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}

html[data-aero][data-aero-native] body[data-ds-dark-theme] #root div:has(> [data-shell-overlay]) {
  background-color: rgba(10, 24, 41, 0.06);
}

html[data-aero][data-aero-native] #root div:has(> [data-shell-overlay]) > div:first-child {
  background-color: rgba(206, 232, 255, 0.26);
  background-image: linear-gradient(180deg,
    rgba(255, 255, 255, 0.30) 0%,
    rgba(255, 255, 255, 0.08) 10%,
    rgba(96, 154, 205, 0.10) 100%);
}

html[data-aero][data-aero-native] body[data-ds-dark-theme] #root div:has(> [data-shell-overlay]) > div:first-child {
  background-color: rgba(14, 34, 56, 0.42);
  background-image: linear-gradient(180deg,
    rgba(120, 180, 235, 0.14) 0%,
    rgba(120, 180, 235, 0.04) 12%,
    rgba(0, 20, 40, 0.10) 100%);
}

/* Fine frosted grain over the whole window: the textured half of "frosted". */
html[data-aero] body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  pointer-events: none;
  opacity: 0.06;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
  background-size: 160px 160px;
}

/* The shell frame is the element that directly owns the overlay layer;
   blurring its backdrop turns every translucent token into real glass. */
html[data-aero] #root div:has(> [data-shell-overlay]) {
  background-color: rgba(238, 247, 255, 0.10);
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.03) 16%, rgba(255, 255, 255, 0) 38%);
  -webkit-backdrop-filter: blur(30px) saturate(190%) brightness(1.06);
  backdrop-filter: blur(30px) saturate(190%) brightness(1.06);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.50),
    inset 0 0 0 2px rgba(96, 156, 214, 0.22),
    inset 0 0 72px rgba(118, 186, 255, 0.14);
}

html[data-aero] body[data-ds-dark-theme] #root div:has(> [data-shell-overlay]) {
  background-color: rgba(10, 24, 41, 0.12);
  background-image: linear-gradient(180deg, rgba(120, 180, 235, 0.10) 0%, rgba(0, 0, 0, 0) 42%);
  box-shadow:
    inset 0 0 0 1px rgba(160, 210, 255, 0.20),
    inset 0 0 80px rgba(40, 130, 220, 0.12);
}

/* DSH rounds the content column's top-left corner for its Windows titlebar
   seam. With a transparent window that radius cuts a notch into the
   sidebar/header junction, so keep the seam square. */
html[data-aero] #root div:has(> [data-shell-overlay]) {
  --dsh-windows-content-radius: 0px;
}

html[data-aero] #root div:has(> [data-shell-overlay]) > div:nth-child(2) {
  border-top-left-radius: 0 !important;
}

/* Keep the conversation header flat: no gradient, no seam line; the header
   and transcript share the same glass and the buttons stay embedded. */
html[data-aero] [class*="Dc7zOa_header"] {
  border-bottom-color: transparent !important;
  background-color: transparent;
  background-image: none;
}

html[data-aero] [class*="Dc7zOa_header"] :is(button, [role="button"], [role="combobox"], [role="tab"]) {
  background-color: transparent !important;
  background-image: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

html[data-aero] [class*="Dc7zOa_header"] :is(button, [role="button"]):hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.10) !important;
}

/* The creation-mode / preset chip is not a plain button in every build; strip
   its pill fill and outline so it sits directly on the header glass. */
html[data-aero] [class*="Dc7zOa_header"] :is([class*="chip"], [class*="badge"], [class*="preset"], [class*="modeChip"], [class*="creation"]) {
  background-color: transparent !important;
  background-image: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

/* This build's creation-mode trigger is a div with a 40% white fill. */
html[data-aero] [class*="Dc7zOa_header"] [class*="b06ba0_trigger"] {
  background-color: transparent !important;
  background-image: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

html[data-aero] [class*="Dc7zOa_header"] [class*="b06ba0_trigger"]:hover {
  background-color: rgba(255, 255, 255, 0.10) !important;
}

/* The File Explorer app icon carries a baked-in white tile; replace the glyph
   with a currentColor folder outline so only the glass shows behind it. */
html[data-aero] [class*="Dc7zOa_header"] button:has(svg[class*="appIcon"]) svg[class*="appIcon"] {
  display: none !important;
}

html[data-aero] [class*="Dc7zOa_header"] button:has(svg[class*="appIcon"]) > div:has(svg[class*="appIcon"]) {
  display: none !important;
}

html[data-aero] [class*="Dc7zOa_header"] button:has(svg[class*="appIcon"])::before {
  content: "";
  width: 16px;
  height: 16px;
  flex: none;
  background-color: currentColor;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M1.6 3.6h4.1l1.3 1.6h7.4v7.2h-12.8z' fill='none' stroke='%23000' stroke-width='1.3' stroke-linejoin='round'/%3E%3C/svg%3E") center / 16px 16px no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M1.6 3.6h4.1l1.3 1.6h7.4v7.2h-12.8z' fill='none' stroke='%23000' stroke-width='1.3' stroke-linejoin='round'/%3E%3C/svg%3E") center / 16px 16px no-repeat;
}

/* The same button uses an <img> app icon in this build. */
html[data-aero] [class*="Dc7zOa_header"] button:has(img[class*="appIcon"]) img[class*="appIcon"],
html[data-aero] [class*="Dc7zOa_header"] button:has(img[class*="appIcon"]) > div:has(img[class*="appIcon"]) {
  display: none !important;
}

html[data-aero] [class*="Dc7zOa_header"] button:has(img[class*="appIcon"])::before {
  content: "";
  width: 16px;
  height: 16px;
  flex: none;
  background-color: currentColor;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M1.6 3.6h4.1l1.3 1.6h7.4v7.2h-12.8z' fill='none' stroke='%23000' stroke-width='1.3' stroke-linejoin='round'/%3E%3C/svg%3E") center / 16px 16px no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M1.6 3.6h4.1l1.3 1.6h7.4v7.2h-12.8z' fill='none' stroke='%23000' stroke-width='1.3' stroke-linejoin='round'/%3E%3C/svg%3E") center / 16px 16px no-repeat;
}

/* Icon buttons can bring their own wrapper tiles/frames; flatten every
   descendant fill in the utilities row so only the glyphs remain. */
html[data-aero] [class*="Dc7zOa_header"] :is([class*="headerUtilities"], [class*="headerCorner"]) * {
  background-color: transparent !important;
  background-image: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

/* The Windows caption strip uses the same glass material as the content:
   one translucent fill, a faint top sheen and a soft bottom fade, instead of
   a separate bright titlebar band. */
html[data-aero][data-windows-titlebar] #root div:has(> [data-shell-overlay])::after {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: var(--dsh-windows-titlebar-height, 40px);
  pointer-events: none;
  z-index: 10;
  background-color: rgba(238, 247, 255, 0.44);
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 55%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 6px 18px rgba(4, 30, 58, 0.10);
  border-bottom: 0;
  -webkit-mask-image: linear-gradient(to bottom, #000 86%, rgba(0, 0, 0, 0.55) 96%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 86%, rgba(0, 0, 0, 0.55) 96%, transparent 100%);
}

html[data-aero][data-windows-titlebar] body[data-ds-dark-theme] #root div:has(> [data-shell-overlay])::after {
  background-color: rgba(12, 26, 42, 0.48);
  background-image: linear-gradient(180deg, rgba(120, 180, 235, 0.10) 0%, rgba(0, 0, 0, 0) 55%);
  box-shadow:
    inset 0 1px 0 rgba(190, 225, 255, 0.28),
    0 6px 18px rgba(0, 0, 0, 0.30);
  border-bottom: 0;
}

/* Inner glass edge along the sidebar column. */
html[data-aero] #root div:has(> [data-shell-overlay]) > div:first-child {
  background-color: rgba(206, 232, 255, 0.38);
  background-image: linear-gradient(180deg,
    rgba(255, 255, 255, 0.42) 0%,
    rgba(255, 255, 255, 0.10) 9%,
    rgba(96, 154, 205, 0.14) 100%);
  box-shadow:
    inset -1px 0 0 rgba(255, 255, 255, 0.55),
    inset -2px 0 0 rgba(70, 130, 185, 0.22);
}

html[data-aero] body[data-ds-dark-theme] #root div:has(> [data-shell-overlay]) > div:first-child {
  background-color: rgba(14, 34, 56, 0.52);
  background-image: linear-gradient(180deg,
    rgba(120, 180, 235, 0.16) 0%,
    rgba(120, 180, 235, 0.04) 12%,
    rgba(0, 20, 40, 0.12) 100%);
  box-shadow:
    inset -1px 0 0 rgba(160, 210, 255, 0.20);
}

/* Elevated surfaces get the pale blue Aero aura. */
html[data-aero] body,
html[data-aero] body * {
  --dsw-elevation-stroke-color: rgba(255, 255, 255, 0.55);
  --dsw-elevation-panel: var(--dsw-elevation-stroke), 0 2px 10px rgba(6, 40, 80, 0.16), 0 0 22px rgba(96, 178, 255, 0.16);
  --dsw-elevation-prominent: var(--dsw-elevation-stroke), 0 4px 18px rgba(6, 40, 80, 0.20), 0 0 30px rgba(96, 178, 255, 0.20);
  --dsw-elevation-soft: var(--dsw-elevation-stroke), 0 6px 22px rgba(6, 40, 80, 0.14), 0 0 26px rgba(120, 195, 255, 0.14);
}

html[data-aero] body[data-ds-dark-theme],
html[data-aero] body[data-ds-dark-theme] * {
  --dsw-elevation-stroke-color: rgba(160, 210, 255, 0.22);
  --dsw-elevation-panel: var(--dsw-elevation-stroke), 0 2px 10px rgba(0, 0, 0, 0.45), 0 0 22px rgba(60, 150, 240, 0.14);
  --dsw-elevation-prominent: var(--dsw-elevation-stroke), 0 4px 18px rgba(0, 0, 0, 0.50), 0 0 30px rgba(60, 150, 240, 0.18);
  --dsw-elevation-soft: var(--dsw-elevation-stroke), 0 6px 22px rgba(0, 0, 0, 0.40), 0 0 26px rgba(50, 140, 230, 0.14);
}

html[data-aero] ::selection {
  background: rgba(58, 150, 225, 0.34);
}

html[data-aero] body[data-ds-dark-theme] ::selection {
  background: rgba(90, 170, 255, 0.36);
}

/* Glossy silver scrollbar thumbs. */
html[data-aero] ::-webkit-scrollbar-thumb {
  background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.50), rgba(255, 255, 255, 0) 60%);
  box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.50);
}

html[data-aero] body[data-ds-dark-theme] ::-webkit-scrollbar-thumb {
  background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0) 60%);
  box-shadow: none;
}

html[data-aero] :focus-visible {
  outline-color: rgba(86, 177, 245, 0.95);
}

/* Aero button gloss on filled primary buttons. */
html[data-aero] button[class*="_primary_"] {
  background-image: linear-gradient(180deg,
    rgba(255, 255, 255, 0.34) 0%,
    rgba(255, 255, 255, 0.10) 47%,
    rgba(255, 255, 255, 0) 48%,
    rgba(0, 20, 40, 0.06) 100%);
  box-shadow:
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.45),
    0 1px 2px rgba(0, 40, 80, 0.20);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.22);
}

/* ============================================================
   Skin controls (always active so the skin can be switched on
   from the default palette).
   ============================================================ */

.dsh-aero-titlebar-toggle {
  display: none;
  position: absolute;
  top: 7px;
  right: 160px;
  z-index: 1;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 10px;
  border: 0.5px solid var(--dsw-alias-border-l3);
  border-radius: 8px;
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 82%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, #ffffff 60%, transparent);
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-app-region: no-drag;
}

html[data-windows-titlebar]:not([data-fullscreen]) .dsh-aero-titlebar-toggle {
  display: inline-flex;
}

.dsh-aero-titlebar-toggle:hover {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l4);
  background: var(--dsw-alias-bg-layer-2);
}

.dsh-aero-titlebar-toggle[aria-pressed="true"] {
  border-color: rgba(255, 255, 255, 0.78);
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.88) 0%, rgba(205, 232, 255, 0.48) 52%, rgba(168, 210, 245, 0.55) 100%);
  box-shadow:
    inset 0 1px 0 #ffffff,
    0 0 10px rgba(92, 172, 238, 0.35);
  color: #0b3556;
}

.dsh-aero-titlebar-toggle[aria-pressed="false"] {
  opacity: 0.62;
}

.dsh-aero-titlebar-toggle[aria-pressed="false"]:hover {
  opacity: 1;
}

.dsh-aero-titlebar-toggle:focus-visible {
  outline: 2px solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  outline-offset: 2px;
}

.dsh-aero-titlebar-toggle svg {
  flex: none;
}

.dsh-aero-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  border-bottom: 0.5px solid var(--dsw-alias-border-l2);
}

.dsh-aero-row-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding-right: 48px;
}

.dsh-aero-row-title {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.dsh-aero-row-desc {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}

.dsh-aero-switch {
  position: relative;
  flex: none;
  width: 38px;
  height: 22px;
  padding: 0;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: 11px;
  background: var(--dsw-alias-bg-layer-1);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  -webkit-app-region: no-drag;
}

.dsh-aero-switch::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--dsw-alias-switch-thumb);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.28);
  transition: transform 0.15s ease;
}

.dsh-aero-switch[aria-checked="true"] {
  border-color: transparent;
  background: var(--dsw-alias-brand-primary);
}

.dsh-aero-switch[aria-checked="true"]::after {
  transform: translateX(16px);
}

.dsh-aero-switch:focus-visible {
  outline: 2px solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .dsh-aero-switch,
  .dsh-aero-switch::after {
    transition: none;
  }
}
`;

    const listeners = new Set();

    function readEnabled() {
      try {
        return window.localStorage.getItem(STORAGE_KEY) !== '0';
      } catch {
        return true;
      }
    }

    function persist(enabled) {
      try {
        window.localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
      } catch {
        /* A browser that refuses storage still gets the in-memory toggle. */
      }
    }

    function subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }

    function emit() {
      for (const listener of [...listeners]) listener();
    }

    function GlassIcon() {
      return h(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 16 16', 'aria-hidden': true },
        h('rect', {
          x: 1.5,
          y: 2.5,
          width: 13,
          height: 11,
          rx: 2.5,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.2,
        }),
        h('path', { d: 'M1.5 5.5h13', stroke: 'currentColor', strokeWidth: 1.2, opacity: 0.75 }),
        h('path', {
          d: 'M3.8 3.7h6.4',
          stroke: 'currentColor',
          strokeWidth: 1.2,
          strokeLinecap: 'round',
          opacity: 0.5,
        }),
      );
    }

    return {
      inject: ['slots', 'theme', 'locale'],
      apply(ctx) {
        const theme = ctx.theme;
        const locale = ctx.locale;
        const t = locale.bind('aero-skin');

        ctx.effect(() => {
          const disposeEn = locale.register('aero-skin', 'en', {
            title: 'Aero glass effect',
            description: 'Translucent glass panels, aurora wallpaper and a glossy title bar inspired by Windows 7 Aero.',
            enable: 'Turn on Aero glass',
            disable: 'Turn off Aero glass',
          });
          const disposeZh = locale.register('aero-skin', 'zh', {
            title: 'Aero 玻璃效果',
            description: '半透明玻璃面板、极光壁纸与高光标题栏，灵感来自 Windows 7 Aero。',
            enable: '开启 Aero 玻璃效果',
            disable: '关闭 Aero 玻璃效果',
          });
          return () => {
            disposeEn();
            disposeZh();
          };
        }, 'aero-skin: locale dictionaries');

        ctx.effect(() => {
          const previous = document.querySelector(`style[data-plugin-css=${JSON.stringify(CSS_TAG)}]`);
          if (previous !== null) previous.remove();
          const style = document.createElement('style');
          style.dataset.plugin = SOURCE;
          style.dataset.pluginCss = CSS_TAG;
          style.textContent = CSS;
          document.head.appendChild(style);
          return () => style.remove();
        }, 'aero-skin: stylesheet');

        let tokenLayer = null;

        const applyTokens = (enabled) => {
          if (tokenLayer !== null) {
            tokenLayer();
            tokenLayer = null;
          }
          if (enabled) tokenLayer = theme.overrideTokens(SOURCE, TOKENS);
        };

        const applySkin = (enabled) => {
          document.documentElement.toggleAttribute('data-aero', enabled);
          applyTokens(enabled);
        };

        const setEnabled = (enabled) => {
          persist(enabled);
          applySkin(enabled);
          emit();
        };

        ctx.effect(() => {
          applySkin(readEnabled());
          return () => {
            applyTokens(false);
            document.documentElement.removeAttribute('data-aero');
          };
        }, 'aero-skin: theme layer');

        const useEnabled = () => {
          const [enabled, setEnabledState] = React.useState(readEnabled);
          React.useEffect(() => subscribe(() => setEnabledState(readEnabled())), []);
          return enabled;
        };

        const useTranslate = () => {
          const [, bump] = React.useState(0);
          React.useEffect(
            () =>
              locale.subscribe(() => {
                bump((value) => value + 1);
              }),
            [],
          );
          return t;
        };

        function TitlebarToggle() {
          const enabled = useEnabled();
          const tr = useTranslate();
          const label = enabled ? tr('disable') : tr('enable');
          return h(
            'button',
            {
              type: 'button',
              className: 'dsh-aero-titlebar-toggle',
              'aria-pressed': enabled,
              'aria-label': label,
              title: label,
              onClick: () => setEnabled(!enabled),
            },
            h(GlassIcon, null),
            h('span', null, 'Aero'),
          );
        }

        function SettingsRow() {
          const enabled = useEnabled();
          const tr = useTranslate();
          return h(
            'div',
            { className: 'dsh-aero-row' },
            h(
              'div',
              { className: 'dsh-aero-row-text' },
              h('div', { className: 'dsh-aero-row-title' }, tr('title')),
              h('div', { className: 'dsh-aero-row-desc' }, tr('description')),
            ),
            h('button', {
              type: 'button',
              role: 'switch',
              'aria-checked': enabled,
              'aria-label': tr('title'),
              className: 'dsh-aero-switch',
              onClick: () => setEnabled(!enabled),
            }),
          );
        }

        ctx.effect(
          () =>
            ctx.slots.inject('shell.overlay', () =>
              ctx.slots.register(
                { name: 'shell.overlay', id: 'aero-skin.toggle', order: 60 },
                TitlebarToggle,
              ),
            ),
          'aero-skin: titlebar toggle',
        );

        ctx.effect(
          () =>
            ctx.slots.inject('settings.general.item', () =>
              ctx.slots.register(
                { name: 'settings.general.item', id: 'aero-skin', order: 13 },
                SettingsRow,
              ),
            ),
          'aero-skin: settings row',
        );

      },
    };
  },
});
